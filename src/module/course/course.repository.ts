import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { Prisma } from '../../../generated/prisma/client';

@Injectable()
export class CourseRepository {
  constructor(private prisma: DatabaseService) {}

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              description: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.course.findMany({
        skip,
        take: limit,
        where,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.course.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  findById(id: string) {
    return this.prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        assessment: true,
        modules: {
          include: {
            assessment: true,
            lessons: true,
          },
        },
      },
    });
  }

  findByIdAndAdminId(id: string, adminId: string) {
    return this.prisma.course.findUnique({
      where: {
        id,
        adminId,
      },
    });
  }

  countAllCourses() {
    return this.prisma.course.count();
  }

  async totalRevenue() {
    const courses = await this.prisma.course.findMany({
      select: {
        price: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    return courses.reduce((sum, course) => {
      return sum + Number(course.price) * course._count.enrollments;
    }, 0);
  }

  async revenueOverTime(startDate?: string, endDate?: string) {
    const courses = await this.prisma.course.findMany({
      select: {
        price: true,

        _count: {
          select: {
            enrollments: {
              where: {
                enrolledAt: {
                  gte: startDate ? new Date(startDate) : undefined,

                  lte: endDate ? new Date(endDate) : undefined,
                },
              },
            },
          },
        },
      },
    });

    return courses.reduce((sum, course) => {
      return sum + Number(course.price) * course._count.enrollments;
    }, 0);
  }

  async popularCourses(limit: number = 10) {
    return this.prisma.course.findMany({
      take: Number(limit),

      orderBy: {
        enrollments: {
          _count: 'desc',
        },
      },

      select: {
        id: true,
        title: true,
        price: true,

        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.CourseCreateInput) {
    return this.prisma.course.create({
      data,
    });
  }

  async update(id: string, data: Prisma.CourseUpdateInput) {
    return this.prisma.course.update({
      where: { id },
      data,
    });
  }
}
