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
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });
  }
}
