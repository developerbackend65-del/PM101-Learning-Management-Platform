import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { TransactionClient } from 'generated/prisma/internal/prismaNamespace';
import { Prisma } from 'generated/prisma/browser';

@Injectable()
export class AssessmentRepository {
  constructor(private prisma: DatabaseService) {}

  create(data: Prisma.AssessmentCreateInput, tx?: TransactionClient) {
    const client = tx ?? this.prisma;
    return client.assessment.create({ data });
  }

  findOne(id: string) {
    return this.prisma.assessment.findUnique({
      where: { id },
      include: {
        questions: {
          select: {
            id: true,
            text: true,
            type: true,
            options: true,
            assessmentId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        course: true,
        module: { include: { course: true } },
      },
    });
  }

  findOneWithAnswers(id: string) {
    return this.prisma.assessment.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });
  }
}
