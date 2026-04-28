import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { ForgetPasswordDTO } from './dto/forget-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { LoginDTO } from './dto/login.dto';
import { Response, CookieOptions } from 'express';
import { daysToMilliseconds } from 'src/shared/time/time.util';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

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
  @HttpCode(200)
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
    const { accessToken, refreshToken } = await this.authService.login(data);

    res.cookie('refresh_token', refreshToken, this.getCookieOptions());

    return {
      message: 'Logged in successfully',
      data: {
        accessToken,
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

  private getCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: daysToMilliseconds(7),
    };
  }
}
