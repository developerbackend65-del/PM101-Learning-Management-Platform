import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { TransactionClient } from 'generated/prisma/internal/prismaNamespace';
import { CreateQuestionDto } from '../assessments/dto/create-question.dto';

@Injectable()
export class QuestionRepository {
  constructor(private prisma: DatabaseService) {}

  createMany(
    assessmentId: string,
    data: CreateQuestionDto[],
    tx?: TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.question.createMany({
      data: data.map((q) => ({ ...q, assessmentId })),
    });
  }
}
