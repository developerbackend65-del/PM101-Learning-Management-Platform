import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { TransactionClient } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class LessonProgressRepository {
  constructor(private readonly prisma: DatabaseService) {}

  upsert(enrollmentId: string, lessonId: string) {
    return this.prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: { enrollmentId, lessonId },
      },
      create: {
        lessonId,
        enrollmentId,
        watchedAt: new Date(),
      },
      update: {},
    });
  }

  complete(enrollmentId: string, lessonId: string, tx?: TransactionClient) {
    const client = tx ?? this.prisma;
    return client.lessonProgress.update({
      where: { enrollmentId_lessonId: { enrollmentId, lessonId } },
      data: { isCompleted: true, completedAt: new Date() },
    });
  }
}
