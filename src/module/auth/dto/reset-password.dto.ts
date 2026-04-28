import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../decorator/match.decorator';

export class ResetPasswordDTO {
  @ApiProperty({
    description: 'New password (minimum 6 characters)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Must match the password field',
  })
  @IsString()
  @IsNotEmpty()
  @Match('password', {
    message: 'Password confirmation does not match the entered password',
  })
  confirmPassword: string;
}
