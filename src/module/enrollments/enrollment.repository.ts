import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';

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
}
