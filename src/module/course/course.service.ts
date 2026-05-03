import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from './course.repository';

@Injectable()
export class CourseService {
  constructor(private courseRepo: CourseRepository) {}

  /**
   * Retrieves a paginated list of courses with an optional search filter.
   *
   * @param page - The page number to retrieve (1-indexed). Defaults to `1`.
   * @param limit - The maximum number of courses per page. Defaults to `10`.
   * @param search - Optional search string to filter courses by name or other fields.
   * @returns A paginated result containing the matching courses.
   */
  public getAllCourses(page: number = 1, limit: number = 10, search?: string) {
    return this.courseRepo.findAll(page, limit, search);
  }

  /**
   * Retrieves a single course by its unique identifier.
   *
   * @param id - The unique identifier of the course to retrieve.
   * @returns The course data matching the provided ID.
   * @throws {NotFoundException} If no course exists with the given ID.
   */
  public async getCourseById(id: string) {
    const course = await this.courseRepo.findById(id);

    if (!course) {
      throw new NotFoundException('no course found with this id');
    }
    return { data: course };
  }
}
