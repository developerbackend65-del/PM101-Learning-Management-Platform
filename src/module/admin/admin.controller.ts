import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { UserRole } from 'generated/prisma/enums';
import { Roles } from 'src/shared/decorators/role.decorator';

@ApiTags('Admin Analytics')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
@ApiForbiddenResponse({ description: 'Requires Admin role' })
@Controller('admin/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  @ApiOperation({
    summary: 'Get dashboard overview stats',
    description:
      'Returns aggregated platform statistics including total users, courses, enrollments, revenue, and active users in the last 30 days.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard stats retrieved successfully',
  })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('enrollments-over-time')
  @ApiOperation({
    summary: 'Get enrollment count over a date range',
    description:
      'Returns the total number of enrollments within the specified date range. If no dates are provided, returns count across all time.',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start of date range in ISO 8601 format',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End of date range in ISO 8601 format',
  })
  @ApiResponse({
    status: 200,
    description: 'Enrollment count retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid date format or startDate is after endDate',
  })
  enrollmentsOverTime(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.adminService.enrollmentsOverTime(startDate, endDate);
  }

  @Get('revenue-over-time')
  @ApiOperation({
    summary: 'Get total revenue over a date range',
    description:
      'Returns total revenue calculated from enrollments within the specified date range. Revenue = sum of (course price × enrollments) per course.',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start of date range in ISO 8601 format',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End of date range in ISO 8601 format',
  })
  @ApiResponse({
    status: 200,
    description: 'Revenue data retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid date format or startDate is after endDate',
  })
  revenueOverTime(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.adminService.revenueOverTime(startDate, endDate);
  }

  @Get('popular-courses')
  @ApiOperation({
    summary: 'Get most popular courses by enrollment',
    description:
      'Returns the top N courses ranked by total enrollment count in descending order.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of courses to return (default: 10, max: 100)',
  })
  @ApiResponse({
    status: 200,
    description: 'Popular courses retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'limit must be a positive integer',
  })
  popularCourses(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.adminService.popularCourses(limit);
  }
}
