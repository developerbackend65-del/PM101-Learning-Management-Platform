import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class AnswerItemDto {
  @ApiProperty({
    description: 'The ID of the question being answered',
  })
  @IsUUID()
  questionId: string;

  @ApiProperty({
    description: "The student's answer to the question",
  })
  @IsString()
  answer: string;
}
