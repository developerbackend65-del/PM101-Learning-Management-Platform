import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../decorator/match.decorator';
import { Gender } from 'generated/prisma/enums';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password (minimum 6 characters)',
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

  @ApiProperty({
    description: 'Gender of the user',
    enum: Gender,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'Date of birth in ISO 8601 format (YYYY-MM-DD)',
  })
  @IsDateString()
  date_of_birth: string;
}
