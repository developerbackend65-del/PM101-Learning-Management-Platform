import {
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { USER_STATUS, UserRole } from 'generated/prisma/enums';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Full name of the user',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({
    description: 'Role assigned to the user',
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Account status of the user',
    enum: USER_STATUS,
  })
  @IsOptional()
  @IsEnum(USER_STATUS)
  status?: USER_STATUS;

  @ApiPropertyOptional({
    description: 'Whether the user email has been verified',
  })
  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;
}
