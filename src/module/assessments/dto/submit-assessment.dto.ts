import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AnswerItemDto } from './answer-item.dto';

export class SubmitAssessmentDto {
  @ApiProperty({
    description: 'List of answers submitted by the student (minimum 1)',
    type: [AnswerItemDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AnswerItemDto)
  answers: AnswerItemDto[];
}
