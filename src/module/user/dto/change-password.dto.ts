import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'The current password of the user',
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'The new password to set, must be at least 6 characters',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
