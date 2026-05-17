import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';

@Injectable()
export class AssessmentSubmissionRepository {
  constructor(private readonly prisma: DatabaseService) {}

  async saveSubmission(data: {
    userId: string;
    assessmentId: string;
    score: number;
    passed: boolean;
    answers: { questionId: string; answer: string; isCorrect: boolean }[];
  }) {
    return this.prisma.assessmentSubmission.create({
      data: {
        userId: data.userId,
        assessmentId: data.assessmentId,
        score: data.score,
        passed: data.passed,
        answers: {
          create: data.answers.map((a) => ({
            questionId: a.questionId,
            answer: a.answer,
            isCorrect: a.isCorrect,
          })),
        },
      },
    });
  }
}
