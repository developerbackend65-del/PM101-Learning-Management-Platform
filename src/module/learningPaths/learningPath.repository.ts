import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { Prisma } from 'generated/prisma/browser';
import { TransactionClient } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class LearningPathRepository {
  constructor(private readonly prisma: DatabaseService) {}

  create(data: Prisma.LearningPathCreateInput, tx?: TransactionClient) {
    const client = tx ?? this.prisma;
    return client.learningPath.create({ data });
  }
}
