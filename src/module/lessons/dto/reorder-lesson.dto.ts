import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReorderLessonDto {
  @ApiProperty({
    description: 'New zero-based position of the lesson within its module',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  orderIndex: number;
}
