import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { TokenRepository } from './repository/token.repository';
import { EVENT_TYPE } from '../../../generated/prisma/enums';
import { mintesToMilliseconds } from 'src/shared/time/time.util';
import { TransactionPort } from '../db/transaction/transaction.port';
import { OutboxRepository } from './repository/outbox.repository';
import { RegisterUserDto } from './dto/register.dto';
import { ForgetPasswordDTO } from './dto/forget-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { LoginDTO } from './dto/login.dto';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tokenRepo: TokenRepository,
    private readonly transaction: TransactionPort,
    private readonly ouboxRepo: OutboxRepository,
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  /**
   * Registers a new user and sends a verification email token.
   *
   * @param dto - The user registration data (name, email, password)
   * @returns A success message prompting the user to check their inbox
   * @throws {BadRequestException} If the email is already associated with an account
   *
   * @remarks
   * This method runs user creation and token generation inside a single
   * database transaction to ensure atomicity — if either operation fails,
   * both are rolled back.
   *
   * @example
   * const result = await authService.register({
   *   name: 'John',
   *   email: 'john@example.com',
   *   password: 'securePassword123',
   * });
   * // { message: 'Verification email sent successfully. Please check your inbox.' }
   */
  public async register(dto: RegisterUserDto) {
    const { name, email, password } = dto;

    const user = await this.userRepo.findByEmail(email);
    if (user)
      throw new BadRequestException(
        'Email is already registered. Please log in.',
      );

    const password_hash = await this.hash(password);

    const token = this.generateToken();

    await this.transaction.run(async (tx) => {
      const NewUser = await this.userRepo.createUser(
        {
          name,
          password_hash,
          email,
        },
        tx,
      );

      await this.tokenRepo.create(
        {
          token,
          user: { connect: { id: NewUser.id } },
          type: EVENT_TYPE.VERIFY_EMAIL,
          expires_at: new Date(Date.now() + mintesToMilliseconds(10)),
        },
        tx,
      );

      await this.ouboxRepo.create(
        {
          payload: {
            email,
            token,
          },
          event_type: EVENT_TYPE.VERIFY_EMAIL,
        },
        tx,
      );
    });

    return {
      message: 'Verification email sent successfully. Please check your inbox.',
    };
  }

  /**
   * Initiates the forgot-password flow for a given email address.
   *
   * If the email is associated with an existing user, this method:
   * 1. Generates a one-time reset token.
   * 2. Persists the token (valid for 15 minutes) in a single transaction alongside
   *    an outbox event, which a background worker will pick up to dispatch the
   *    reset-password email.
   *
   * Regardless of whether the email exists, the same generic message is returned
   * to prevent user enumeration attacks.
   *
   * @param dto - The forgot-password request payload containing the user's email.
   * @returns A promise resolving to an object with a generic status `message`.
   *
   * @example
   * const result = await authService.forgetPassword({ email: 'user@example.com' });
   * // { message: 'If this email exists, we sent a reset link' }
   */
  public async forgetPassword(dto: ForgetPasswordDTO) {
    const { email } = dto;
    const user = await this.userRepo.findByEmail(email);

    if (user) {
      const token = this.generateToken();

      await this.transaction.run(async (tx) => {
        await this.tokenRepo.create(
          {
            token,
            user: { connect: { id: user.id } },
            type: EVENT_TYPE.RESET_PASSWORD,
            expires_at: new Date(Date.now() + mintesToMilliseconds(10)),
          },
          tx,
        );

        await this.ouboxRepo.create(
          {
            payload: {
              email,
              token,
            },
            event_type: EVENT_TYPE.RESET_PASSWORD,
          },
          tx,
        );
      });
    }

    return { message: 'If this email exists, we sent a reset link' };
  }

  /**
   * Resets a user's password using a valid, unexpired reset token.
   *
   * Validates the provided token, hashes the new password, then atomically
   * updates the user's password and marks the token as used within a single
   * transaction, preventing the token from being reused.
   *
   * @param token - The one-time password reset token issued during the forgot-password flow.
   * @param dto - The reset-password payload containing the new plain-text password.
   * @returns A promise resolving to an object with a confirmation `message`.
   *
   * @throws {BadRequestException} If the token does not exist or has already been used.
   * @throws {BadRequestException} If the token has passed its 15-minute expiry window.
   *
   * @example
   * const result = await authService.resetPassword('abc123', { password: 'NewP@ssw0rd!' });
   * // { message: 'Your password has been reset successfully. Please log in with your new password.' }
   */
  public async resetPassword(
    token: string,
    dto: ResetPasswordDTO,
  ): Promise<{ message: string }> {
    const { password } = dto;

    const record = await this.tokenRepo.findByToken(token);

    if (!record) {
      throw new BadRequestException('Invalid or already used reset token');
    }

    if (record.expires_at < new Date()) {
      throw new BadRequestException(
        'This reset link has expired. Please request a new one.',
      );
    }

    const hashPassword = await this.hash(password);

    await this.transaction.run(async (tx) => {
      await this.userRepo.updatePassword(record.user.id, hashPassword, tx);
      await this.tokenRepo.used(token, tx);
    });

    return {
      message:
        'Your password has been reset successfully. Please log in with your new password.',
    };
  }

  /**
   * Authenticates a user with their email and password credentials.
   *
   * Uses a constant-time fake hash comparison when the email is not found,
   * preventing timing-based user enumeration attacks.
   *
   * On success:
   * - Issues a short-lived JWT access token.
   * - Issues a long-lived JWT refresh token (stored as a hash in the DB).
   *
   * @param dto - The login payload containing the user's email and password.
   * @returns A promise resolving to an object containing the `accessToken` and `refreshToken`.
   *
   * @throws {UnauthorizedException} If the email does not exist or the password is incorrect.
   * @throws {BadRequestException}   If the user's email address has not been verified yet.
   *
   * @example
   * const tokens = await authService.login({ email: 'user@example.com', password: 'P@ssw0rd!' });
   * // { accessToken: 'eyJ...', refreshToken: 'eyJ...' }
   */
  public async login(
    dto: LoginDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = dto;

    const FAKE_HASH = '$2b$10$abcdefghijklmnopqrstuv1234567890';

    const user = await this.userRepo.findByEmail(email);

    let isValid = false;

    if (user) {
      isValid = await this.compare(password, user.password_hash);
    } else {
      await this.compare(password, FAKE_HASH);
    }

    if (!user || !isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.is_verified) {
      throw new BadRequestException(
        'Please verify your email before logging in',
      );
    }

    const payload: JwtPayload = { id: user.id, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>(
        'JWT_REFRESH_EXPIRES_IN',
      ) as StringValue,
    });

    const refresh_token_hash = await this.hash(refreshToken);

    await this.userRepo.updateRefreshToken(user.id, refresh_token_hash);

    return { accessToken, refreshToken };
  }

  /**
   * Verifies a user's email address using a one-time verification token.
   *
   * Looks up the token, validates it is genuine and unexpired, then atomically
   * marks the user as verified and invalidates the token in a single transaction
   * to prevent the token from being reused.
   *
   * @param token - The one-time email verification token sent to the user's inbox.
   * @returns A promise resolving to an object with a confirmation `message`.
   *
   * @throws {BadRequestException} If the token does not exist or has already been used.
   * @throws {BadRequestException} If the token has passed its expiry window.
   *
   * @example
   * const result = await authService.verifyEmail('abc123');
   * // { message: 'Email verified successfully. You can now log in.' }
   */
  public async verifyEmail(token: string): Promise<{ message: string }> {
    const record = await this.tokenRepo.findByToken(token);

    if (!record) {
      throw new BadRequestException(
        'Invalid or already used verification token',
      );
    }

    if (record.expires_at < new Date()) {
      throw new BadRequestException(
        'This verification link has expired. Please request a new one.',
      );
    }

    await this.transaction.run(async (tx) => {
      await this.userRepo.verify(record.user.id, tx);
      await this.tokenRepo.used(token, tx);
    });

    return {
      message: 'Email verified successfully. You can now log in.',
    };
  }

  private generateToken() {
    return randomBytes(32).toString('hex');
  }

  private hash(data: string) {
    return bcrypt.hash(data, 10);
  }

  private compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
