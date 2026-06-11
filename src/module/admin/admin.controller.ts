import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  ParseUUIDPipe,
  Param,
  Body,
  Patch,
  HttpStatus,
  HttpCode,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { UserRole } from 'generated/prisma/enums';
import { Roles } from 'src/shared/decorators/role.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { PermissionGuard } from 'src/shared/guards/permission.guard';
import { RequirePermission } from 'src/shared/decorators/require-permission.decorator';

@ApiTags('Admin Analytics')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
@ApiForbiddenResponse({ description: 'Requires Admin role' })
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('analytics/overview')
  @RequirePermission('view_analytics')
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

  @Get('analytics/enrollments-over-time')
  @RequirePermission('view_analytics')
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

  @Get('analytics/revenue-over-time')
  @RequirePermission('view_analytics')
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

  @Get('analytics/popular-courses')
  @RequirePermission('view_analytics')
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

  @Get('users')
  @RequirePermission('manage_users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'john' })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiOkResponse({
    description: 'Paginated list of users',
  })
  allUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.allUsers(page, limit, search, role);
  }

  @Get('users/:id')
  @RequirePermission('manage_users')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({
    description: 'User found',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getUser(id);
  }

  @Patch('users/:id')
  @RequirePermission('manage_users')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({
    description: 'User updated successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Patch('users/:id/ban')
  @RequirePermission('manage_users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ban a user' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({
    description: 'User banned successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({
    description: 'User is already banned or deleted',
  })
  banUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.banUser(id);
  }

  @Patch('users/:id/unban')
  @RequirePermission('manage_users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unban a user' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({
    description: 'User unbanned successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({
    description: 'User is not currently banned',
  })
  unbanUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.unbanUser(id);
  }

  @Delete('users/:id')
  @RequirePermission('manage_users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete a user' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({
    description: 'User deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({
    description: 'User is already deleted',
  })
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteUser(id);
  }
}
