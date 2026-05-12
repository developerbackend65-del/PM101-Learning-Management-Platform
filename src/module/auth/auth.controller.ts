import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { ForgetPasswordDTO } from './dto/forget-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { LoginDTO } from './dto/login.dto';
import { Response, CookieOptions, Request } from 'express';
import { daysToMilliseconds } from 'src/shared/time/time.util';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RequestRestoreDTO } from './dto/request-restore.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //@route   POST ~/auth/register
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or bad request' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  public async register(@Body() body: RegisterUserDto) {
    return this.authService.register(body);
  }

  //@route   POST ~/auth/forgot-password
  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset email to the user' })
  @ApiBody({ type: ForgetPasswordDTO })
  @ApiResponse({ status: 200, description: 'Reset email sent successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or bad request' })
  @ApiResponse({ status: 404, description: 'User with this email not found' })
  public async forgetPassword(@Body() body: ForgetPasswordDTO) {
    return this.authService.forgetPassword(body);
  }

  //@route   POST ~/auth/reset-password?token=<token>
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password using a valid token' })
  @ApiBody({ type: ResetPasswordDTO })
  @ApiQuery({
    name: 'token',
    required: true,
    description: 'Password reset token sent to the user email',
  })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or bad request' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  public async resetPassword(
    @Body() body: ResetPasswordDTO,
    @Query('token') token: string,
  ) {
    return this.authService.resetPassword(token, body);
  }

  //@route   POST ~/auth/login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and get access token' })
  @ApiBody({ type: LoginDTO })
  @ApiResponse({
    status: 200,
    description: 'Logged in successfully, refresh token set in cookie',
    schema: {
      example: {
        message: 'Logged in successfully',
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error or bad request' })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  public async login(
    @Res({ passthrough: true }) res: Response,
    @Body() data: LoginDTO,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(data);

    res.cookie('refresh_token', refreshToken, this.getCookieOptions());

    return {
      message: 'Logged in successfully',
      data: {
        accessToken,
        user,
      },
    };
  }

  //@route   Get ~/auth/verify-email
  @Get('verify-email')
  @ApiOperation({ summary: 'Verify user email using a valid token' })
  @ApiQuery({
    name: 'token',
    required: true,
    description: 'Email verification token sent to the user email',
  })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or bad request' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  public async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  //@route   Post ~/auth/refresh
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('refreshToken')
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Validates the provided refresh token and returns a new access token. ' +
      'The refresh token must be sent as a Bearer token in the Authorization header.',
  })
  @ApiOkResponse({
    description: 'Access token refreshed successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid refresh token',
        error: 'Unauthorized',
      },
    },
  })
  public async refreshAccessToken(@Req() req: Request) {
    const { id, refreshToken } = req.user as {
      id: string;
      refreshToken: string;
    };

    return this.authService.refreshAccessToken(id, refreshToken);
  }

  //@route   Post ~/auth/restore
  @Post('restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request account restore',
    description:
      'Sends a restore link to the provided email if an account exists. ' +
      'Always returns a generic message to prevent user enumeration attacks.',
  })
  @ApiBody({ type: RequestRestoreDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Restore link sent (or silently skipped if email not found).',
  })
  public async requestRestore(
    @Body() dto: RequestRestoreDTO,
  ): Promise<{ message: string }> {
    return this.authService.requestRestore(dto);
  }

  //@route   Get ~/auth/restore/confirm
  @Get('restore/confirm')
  @ApiOperation({
    summary: 'Confirm account restore',
    description:
      'Validates the restore token and restores the account. ' +
      'The token is issued via email and expires in 10 minutes.',
  })
  @ApiQuery({
    name: 'token',
    required: true,
    description: 'The restore token received in the email link.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Account restored successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Token is invalid, wrong type, or has expired.',
  })
  public async confirmRestore(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    return this.authService.confirmRestore(token);
  }

  private getCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: daysToMilliseconds(7),
    };
  }
}
