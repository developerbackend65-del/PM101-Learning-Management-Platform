import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { Prisma } from 'generated/prisma/browser';
import { TransactionClient } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class LearningPathRepository {
  private readonly baseSelect = {
    id: true,
    title: true,
    description: true,
    createdAt: true,
  } as const;

  constructor(private readonly prisma: DatabaseService) {}

  create(data: Prisma.LearningPathCreateInput, tx?: TransactionClient) {
    const client = tx ?? this.prisma;
    return client.learningPath.create({ data });
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [paths, total] = await Promise.all([
      this.prisma.learningPath.findMany({
        skip,
        take: limit,

        select: {
          ...this.baseSelect,

          _count: {
            select: {
              items: true,
            },
          },

          items: {
            select: {
              course: {
                select: {
                  duration: true,
                },
              },
            },
          },
        },
      }),

      this.prisma.learningPath.count(),
    ]);

    return {
      paths,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(pathId: string, studentId: string) {
    return this.prisma.learningPath.findUnique({
      where: {
        id: pathId,
      },

      select: {
        ...this.baseSelect,

        items: {
          orderBy: {
            order: 'asc',
          },

          select: {
            order: true,

            course: {
              select: {
                id: true,
                title: true,
                description: true,
                thumbnailUrl: true,
                duration: true,
                level: true,
                price: true,
                createdAt: true,

                enrollments: {
                  where: {
                    studentId,
                  },

                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
