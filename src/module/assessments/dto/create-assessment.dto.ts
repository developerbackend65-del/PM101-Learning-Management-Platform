import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateQuestionDto } from './create-question.dto';

export class CreateAssessmentDto {
  @ApiProperty({
    description: 'Title of the assessment',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Course ID — provide this OR moduleId, not both',
  })
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @ApiPropertyOptional({
    description: 'Module ID — provide this OR courseId, not both',
  })
  @IsOptional()
  @IsUUID()
  moduleId?: string;

  @ApiProperty({
    description: 'Minimum score (0–100) required to pass',
    minimum: 0,
    maximum: 100,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  passingScore: number;

  @ApiPropertyOptional({
    description: 'Time limit in minutes (optional)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  timeLimit?: number;

  @ApiProperty({
    description: 'List of questions (minimum 1)',
    type: [CreateQuestionDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
