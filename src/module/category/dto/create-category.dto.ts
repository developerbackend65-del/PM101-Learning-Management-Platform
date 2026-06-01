import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'A brief description of the category',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
