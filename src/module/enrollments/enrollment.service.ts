import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EnrollmentRepository } from './enrollment.repository';
import { CourseRepository } from '../course/course.repository';
import { Enrollment } from 'generated/prisma/browser';

@Injectable()
export class EnrollmentService {
  constructor(
    private readonly enrollmentRepo: EnrollmentRepository,
    private readonly courseRepo: CourseRepository,
  ) {}

  /**
   * Enrolls a user in a course.
   *
   * Validates that the course exists and that the user is not already enrolled
   * before creating a new enrollment record.
   *
   * @param userId - The unique identifier of the user to enroll.
   * @param courseId - The unique identifier of the course to enroll the user in.
   * @returns A promise that resolves to the newly created {@link Enrollment} record.
   *
   * @throws {NotFoundException} If no course with the given `courseId` exists.
   * @throws {BadRequestException} If the user is already enrolled in the course.
   *
   * @example
   * const enrollment = await enrollmentService.createEnrollment('user-123', 'course-456');
   */
  async createEnrollment(userId: string, courseId: string) {
    const course = await this.courseRepo.findById(courseId);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Prevent duplicate enrollments
    const existingEnrollment = await this.enrollmentRepo.findByUserAndCourse(
      userId,
      courseId,
    );

    if (existingEnrollment) {
      throw new BadRequestException('Student already enrolled in this course');
    }

    const enrollment = await this.enrollmentRepo.create(userId, courseId);
    return { data: enrollment };
  }

  /**
   * Retrieves all enrollments for a given student.
   *
   * @param userId - The unique identifier of the student.
   * @returns A promise that resolves to an array of {@link Enrollment} records for the student.
   *
   * @example
   * const enrollments = await enrollmentService.findStudentEnrollments('user-123');
   */
  findStudentEnrollments(userId: string): Promise<Enrollment[]> {
    return this.enrollmentRepo.findStudentEnrollments(userId);
  }
}
