import { Injectable } from '@nestjs/common';
import { CourseRepository } from '../course/course.repository';
import { EnrollmentRepository } from '../enrollments/enrollment.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AdminService {
  constructor(
    private readonly courseRepo: CourseRepository,
    private readonly enrollmentRepo: EnrollmentRepository,
    private readonly userRepo: UserRepository,
  ) {}

  /**
   * Retrieves aggregated dashboard statistics for the admin panel.
   *
   * Fetches all metrics in parallel using Promise.all to minimize response time.
   *
   * @returns {Promise<{ data: {
   *   totalUsers: number,
   *   totalCourses: number,
   *   totalEnrollments: number,
   *   totalRevenue: number,
   *   activeUsers: number
   * } }>} An object containing key platform statistics.
   */
  async getDashboardStats() {
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      activeUsers,
    ] = await Promise.all([
      this.userRepo.countAllUsers(),
      this.courseRepo.countAllCourses(),
      this.enrollmentRepo.countAllEnrollments(),
      this.courseRepo.totalRevenue(),
      this.userRepo.activeUserLast30Days(),
    ]);

    return {
      data: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalRevenue,
        activeUsers,
      },
    };
  }

  /**
   * Retrieves the total number of enrollments within an optional date range.
   *
   * If no dates are provided, counts all enrollments across all time.
   * Both dates are inclusive.
   *
   * @param {string} [startDate] - The start of the date range in ISO 8601 format (e.g. "2024-01-01").
   * @param {string} [endDate]   - The end of the date range in ISO 8601 format (e.g. "2024-12-31").
   *
   * @returns {Promise<{ data: number }>} Total enrollment count within the given range.
   *
   * @throws {BadRequestException} If either date string is not a valid date format.
   * @throws {BadRequestException} If startDate is after endDate.
   */
  async enrollmentsOverTime(startDate?: string, endDate?: string) {
    const enrollmentCount = await this.enrollmentRepo.enrollmentsOverTime(
      startDate,
      endDate,
    );

    return {
      data: enrollmentCount,
    };
  }

  /**
   * Retrieves the total revenue generated within an optional date range.
   *
   * Revenue is calculated by summing (course price × enrollment count)
   * for all enrollments that fall within the specified date window.
   * If no dates are provided, calculates revenue across all time.
   *
   * @param {string} [startDate] - The start of the date range in ISO 8601 format (e.g. "2024-01-01").
   * @param {string} [endDate]   - The end of the date range in ISO 8601 format (e.g. "2024-12-31").
   *
   * @returns {Promise<{ data: number }>} Total revenue as a numeric value.
   *
   * @throws {BadRequestException} If either date string is not a valid date format.
   * @throws {BadRequestException} If startDate is after endDate.
   */
  async revenueOverTime(startDate?: string, endDate?: string) {
    const revenue = await this.courseRepo.revenueOverTime(startDate, endDate);

    return {
      data: revenue,
    };
  }

  /**
   * Retrieves the most popular courses ranked by total enrollment count.
   *
   * Results are sorted in descending order — the course with the most
   * enrollments appears first. Use the `limit` parameter to control
   * how many courses are returned.
   *
   * @param {number} limit - The maximum number of courses to return. Must be a positive integer.
   *                         Recommended to cap at 100 to avoid large payloads.
   *
   * @returns {Promise<{ data: Array<{
   *   id: string,
   *   title: string,
   *   price: number,
   *   enrollmentCount: number
   * }> }>} A ranked list of popular courses with their enrollment counts.
   *
   * @throws {BadRequestException} If limit is not a positive integer.
   */
  async popularCourses(limit: number) {
    const courses = await this.courseRepo.popularCourses(limit);

    return {
      data: courses,
    };
  }
}
