import { IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LearningPathItemDto {
  @ApiProperty({
    description: 'The unique identifier of the course',
    format: 'uuid',
  })
  @IsUUID()
  courseId: string;

  @ApiProperty({
    description:
      'The position of the course within the learning path (1-based)',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  order: number;
}
