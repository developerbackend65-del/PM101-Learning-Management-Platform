import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CourseRepository } from '../course/course.repository';
import { EnrollmentRepository } from '../enrollments/enrollment.repository';
import { UserRepository } from '../user/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_STATUS } from 'generated/prisma/enums';

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

  /**
   * Retrieves a paginated list of users with optional filtering.
   *
   * @param page    - Page number (1-based). Defaults to 1.
   * @param limit   - Number of users per page. Defaults to 20.
   * @param search  - Optional search term matched against name and email.
   * @param role    - Optional role filter (e.g. 'admin', 'user').
   * @returns Paginated user list with meta: total, page, limit, totalPages.
   */
  async allUsers(
    page?: number,
    limit?: number,
    search?: string,
    role?: string,
  ) {
    const { users, meta } = await this.userRepo.getUsers(
      page,
      limit,
      search,
      role,
    );

    return {
      data: users,
      meta,
    };
  }

  /**
   * Retrieves a single user by ID, including their enrollments.
   *
   * @param userId - The unique identifier of the user.
   * @returns The user object wrapped in `{ data }`.
   * @throws {NotFoundException} If no user with the given ID exists.
   */
  async getUser(userId: string) {
    const user = await this.userRepo.getUser(userId);

    return { data: user };
  }

  /**
   * Updates an existing user's profile fields.
   *
   * @param id   - The unique identifier of the user to update.
   * @param data - Partial user fields to update (see {@link UpdateUserDto}).
   * @returns A success message and the updated user object.
   * @throws {NotFoundException} If no user with the given ID exists.
   */
  async updateUser(id: string, data: UpdateUserDto) {
    const user = await this.userRepo.updateUser(id, data);

    return {
      message: 'update successful',
      data: user,
    };
  }

  /**
   * Bans a user, preventing them from accessing the platform.
   *
   * @param id - The unique identifier of the user to ban.
   * @returns A success message on completion.
   * @throws {NotFoundException}   If no user with the given ID exists.
   * @throws {BadRequestException} If the user is already banned or is deleted.
   */
  async banUser(id: string) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new NotFoundException(`User with this ID not found`);
    }

    if (user.status === USER_STATUS.Ban) {
      throw new BadRequestException('User is already banned');
    }

    if (user.status === USER_STATUS.Delete) {
      throw new BadRequestException('Cannot ban a deleted user');
    }

    await this.userRepo.banUser(id);
    return { message: 'User banned successfully' };
  }

  /**
   * Lifts an existing ban, restoring the user's active status.
   *
   * @param id - The unique identifier of the user to unban.
   * @returns A success message on completion.
   * @throws {NotFoundException}   If no user with the given ID exists.
   * @throws {BadRequestException} If the user is not currently banned.
   */
  async unbanUser(id: string) {
    const user = await this.userRepo.getUser(id);

    if (!user) {
      throw new NotFoundException(`User with this ID not found`);
    }

    if (user.status !== USER_STATUS.Ban) {
      throw new BadRequestException('User is not banned');
    }

    await this.userRepo.unbanUser(id);
    return { message: 'User unbanned successfully' };
  }

  /**
   * Soft-deletes a user by marking their status as deleted.
   * The record is retained in the database for audit purposes.
   *
   * @param id - The unique identifier of the user to delete.
   * @returns A success message on completion.
   * @throws {NotFoundException}   If no user with the given ID exists.
   * @throws {BadRequestException} If the user is already deleted.
   */
  async deleteUser(id: string) {
    const user = await this.userRepo.getUser(id);

    if (!user) {
      throw new NotFoundException(`User with this ID not found`);
    }

    if (user.status === USER_STATUS.Delete) {
      throw new BadRequestException('User is already deleted');
    }

    await this.userRepo.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
