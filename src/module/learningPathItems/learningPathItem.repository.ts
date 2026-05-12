import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { TransactionClient } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class LearningPathItemRepository {
  constructor(private readonly prisma: DatabaseService) {}

  createMany(
    pathId: string,
    courses: {
      courseId: string;
      order: number;
    }[],
    tx?: TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.learningPathItem.createMany({
      data: courses.map((course) => ({
        pathId,
        courseId: course.courseId,
        order: course.order,
      })),
    });
  }
}
