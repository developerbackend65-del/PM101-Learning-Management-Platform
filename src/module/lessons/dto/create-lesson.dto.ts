import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({
    description: 'Title of the lesson',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Main content or description of the lesson',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'URL of the lesson video',
  })
  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @ApiProperty({
    description: 'Zero-based display order of the lesson within its module',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  orderIndex: number;
}
