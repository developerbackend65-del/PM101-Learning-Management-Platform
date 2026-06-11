// dto/create-sub-admin.dto.ts
import {
  IsEmail,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
  MinLength,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'generated/prisma/enums';

export class CreateSubAdminDto {
  @ApiProperty({
    description: 'Full name of the user',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password (minimum 6 characters)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Gender of the user',
    enum: Gender,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ description: 'Date of birth in ISO 8601 format (YYYY-MM-DD)' })
  @IsDateString()
  date_of_birth: string;

  @ApiProperty({
    type: [String],
    description: 'List of permission IDs to assign to the sub-admin',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  permissionIds: string[];
}
