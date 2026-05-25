import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import {
  Decimal,
  TransactionClient,
} from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class EnrollmentRepository {
  constructor(private prisma: DatabaseService) {}

  create(studentId: string, courseId: string) {
    return this.prisma.enrollment.create({
      data: {
        student: {
          connect: {
            id: studentId,
          },
        },

        course: {
          connect: {
            id: courseId,
          },
        },
      },
    });
  }

  findStudentEnrollments(studentId: string) {
    return this.prisma.enrollment.findMany({
      where: {
        studentId,
      },

      include: {
        course: true,
      },
    });
  }

  findByUserAndCourse(studentId: string, courseId: string) {
    return this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });
  }

  async recalculateProgress(
    enrollmentId: string,
    courseId: string,
    tx?: TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    const [totalLessons, completedLessons] = await Promise.all([
      this.prisma.lesson.count({
        where: { module: { courseId } },
      }),
      this.prisma.lessonProgress.count({
        where: { enrollmentId, isCompleted: true },
      }),
    ]);

    const progress =
      totalLessons === 0
        ? new Decimal(0)
        : new Decimal(completedLessons).div(totalLessons).toDecimalPlaces(3);

    return client.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progress,
        ...(progress.equals(1) && {
          completedAt: new Date(),
        }),
      },
    });
  }

  countAllEnrollments() {
    return this.prisma.enrollment.count();
  }

  async enrollmentsOverTime(startDate?: string, endDate?: string) {
    return this.prisma.enrollment.count({
      where: {
        enrolledAt: {
          gte: startDate ? new Date(startDate) : undefined,

          lte: endDate ? new Date(endDate) : undefined,
        },
      },
    });
  }
}
