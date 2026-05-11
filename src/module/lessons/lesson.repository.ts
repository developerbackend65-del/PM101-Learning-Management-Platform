import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';

@Injectable()
export class LessonRepository {
  constructor(private readonly prisma: DatabaseService) {}

  findOne(lessonId: string, courseId: string) {
    return this.prisma.lesson.findFirst({
      where: {
        id: lessonId,
        module: {
          course: {
            id: courseId,
          },
        },
      },
    });
  }
}
