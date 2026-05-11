import { BadRequestException, Injectable } from '@nestjs/common';
import { LearningPathRepository } from './learningPath.repository';
import { CreateLearningPathDto } from './dto/create-learnPath.dto';
import { LearningPathItemRepository } from '../learningPathItems/learningPathItem.repository';
import { TransactionPort } from '../db/transaction/transaction.port';

@Injectable()
export class LearningPathService {
  constructor(
    private readonly learnPathRepo: LearningPathRepository,
    private readonly learningPathItemRepo: LearningPathItemRepository,
    private readonly transaction: TransactionPort,
  ) {}

  /**
   * Creates a new learning path with associated course items.
   *
   * @param dto - The data transfer object containing learning path details.
   * @param dto.title - The title of the learning path.
   * @param dto.description - A brief description of the learning path.
   * @param dto.courses - An ordered list of courses to include, each with a `courseId` and optional metadata.
   * @param userId - The ID of the authenticated user creating the learning path.
   *
   * @returns A promise resolving to a success message object.
   *
   * @throws {BadRequestException} If the `courses` array contains duplicate `courseId` entries.
   *
   * @example
   * await learningPathService.create(
   *   {
   *     title: 'Full-Stack Fundamentals',
   *     description: 'A curated path for beginners',
   *     courses: [{ courseId: 'abc' }, { courseId: 'def' }],
   *   },
   *   'user-123',
   * );
   */
  async create(dto: CreateLearningPathDto, userId: string) {
    const { title, description, courses } = dto;

    const courseIds = courses.map((course) => course.courseId);

    if (new Set(courseIds).size !== courseIds.length) {
      throw new BadRequestException(
        'Duplicate course IDs are not allowed in a learning path',
      );
    }

    return this.transaction.run(async (tx) => {
      const path = await this.learnPathRepo.create(
        {
          title,
          description,
          creator: { connect: { id: userId } },
        },
        tx,
      );

      await this.learningPathItemRepo.createMany(path.id, courses, tx);

      return { message: 'Learning path created successfully' };
    });
  }
}
