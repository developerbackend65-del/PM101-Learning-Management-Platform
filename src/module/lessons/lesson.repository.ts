import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { Prisma } from '../../../generated/prisma/client';

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

  create(data: Prisma.LessonCreateInput) {
    return this.prisma.lesson.create({ data });
  }

  update(data: Prisma.LessonUpdateInput, lessonId: string) {
    return this.prisma.lesson.update({
      where: { id: lessonId },
      data,
    });
  }

  delete(lessonId: string) {
    return this.prisma.lesson.delete({
      where: { id: lessonId },
    });
  }

  findById(id: string) {
    return this.prisma.lesson.findUnique({
      where: { id },
    });
  }
}
