import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourseLevel, CourseStatus } from 'generated/prisma/enums';

export class CreateCourseDto {
  @ApiProperty({
    description: 'The title of the course',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'A brief description of the course',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Duration of the course in minutes',
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({
    description: 'The difficulty level of the course',
    enum: CourseLevel,
  })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiPropertyOptional({
    description: 'The price of the course in USD',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: 'The publication status of the course',
    enum: CourseStatus,
  })
  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @ApiPropertyOptional({
    description: 'The UUID of the category this course belongs to',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
