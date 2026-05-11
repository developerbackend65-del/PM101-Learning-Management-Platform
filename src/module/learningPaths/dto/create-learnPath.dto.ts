import {
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LearningPathItemDto } from './create-learnPathItem.dto';

export class CreateLearningPathDto {
  @ApiProperty({
    description: 'The title of the learning path',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'A brief description of the learning path',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'An ordered list of courses to include in the learning path',
    type: [LearningPathItemDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1, {
    message: 'Courses array cannot be empty',
  })
  @ValidateNested({ each: true })
  @Type(() => LearningPathItemDto)
  courses: LearningPathItemDto[];
}
