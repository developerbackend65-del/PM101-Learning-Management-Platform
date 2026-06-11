import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'The display name of the user',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Date of birth in ISO 8601 format (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  date_of_birth?: string;
}
