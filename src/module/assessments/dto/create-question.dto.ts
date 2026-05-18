import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QuestionType } from 'generated/prisma/enums';

export class CreateQuestionDto {
  @ApiProperty({
    description: 'The question text',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Type of the question',
    enum: QuestionType,
  })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiPropertyOptional({
    description: 'Answer options (required for MULTIPLE_CHOICE questions)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @ApiProperty({
    description: 'The correct answer to the question',
  })
  @IsString()
  correctAnswer: string;
}
