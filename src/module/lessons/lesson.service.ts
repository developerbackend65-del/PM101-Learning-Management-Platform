import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LessonRepository } from './lesson.repository';
import { EnrollmentRepository } from '../enrollments/enrollment.repository';
import { LessonProgressRepository } from '../lessonProgress/lessonProgress.repository';
import { TransactionPort } from '../db/transaction/transaction.port';

@Injectable()
export class LessonService {
  constructor(
    private readonly lessonRepo: LessonRepository,
    private readonly enrollmentRepo: EnrollmentRepository,
    private readonly lessonProgressRepo: LessonProgressRepository,
    private readonly transaction: TransactionPort,
  ) {}

  /**
   * Retrieves a single lesson by its ID within a specific course.
   * If a studentId is provided, tracks lesson progress (lazy creation).
   *
   * @param lessonId - The unique identifier of the lesson to retrieve
   * @param courseId - The unique identifier of the course the lesson belongs to
   * @param studentId - (optional) The student viewing the lesson, used for progress tracking
   * @returns A promise that resolves to the found lesson entity
   * @throws {NotFoundException} When no lesson matches the given IDs
   * @throws {ForbiddenException} When the student is not enrolled in the course
   */
  public async findOne(lessonId: string, courseId: string, studentId: string) {
    const lesson = await this.lessonRepo.findOne(lessonId, courseId);

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const enrollment = await this.enrollmentRepo.findByUserAndCourse(
      studentId,
      courseId,
    );

    if (!enrollment) {
      throw new ForbiddenException('You are not enrolled in this course');
    }

    await this.lessonProgressRepo.upsert(enrollment.id, lessonId);

    return lesson;
  }

  /**
   * Marks a lesson as completed for a specific student and updates enrollment progress.
   *
   * Validates that the lesson exists and the student is enrolled in the course,
   * then atomically completes the lesson and recalculates the overall course progress.
   * If all lessons are completed, the enrollment status is updated to COMPLETED.
   *
   * @param lessonId - The unique identifier of the lesson to complete
   * @param courseId - The unique identifier of the course the lesson belongs to
   * @param studentId - The unique identifier of the student completing the lesson
   * @returns A promise that resolves to the completed lesson entity
   * @throws {NotFoundException} When no lesson matches the given lessonId and courseId
   * @throws {ForbiddenException} When the student is not enrolled in the course
   *
   * @example
   * const lesson = await this.lessonService.completeLesson(
   *   'lesson-uuid',
   *   'course-uuid',
   *   'student-uuid',
   * );
   */
  public async completeLesson(
    lessonId: string,
    courseId: string,
    studentId: string,
  ) {
    const lesson = await this.lessonRepo.findOne(lessonId, courseId);

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const enrollment = await this.enrollmentRepo.findByUserAndCourse(
      studentId,
      courseId,
    );

    if (!enrollment) {
      throw new ForbiddenException('You are not enrolled in this course');
    }

    return this.transaction.run(async (tx) => {
      await this.lessonProgressRepo.complete(enrollment.id, lessonId, tx);

      await this.enrollmentRepo.recalculateProgress(
        enrollment.id,
        courseId,
        tx,
      );

      return lesson;
    });
  }
}
