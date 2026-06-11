import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { EnrollmentService } from './enrollment.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/decorators/role.decorator';
import { UserRole } from '../../../generated/prisma/enums';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STUDENT)
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  //@route   Post ~/enrollments/:courseId
  @Post(':courseId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Enroll in a course',
    description:
      'Enrolls the currently authenticated student in the specified course. Each student can only enroll once per course.',
  })
  @ApiParam({
    name: 'courseId',
    description: 'UUID of the course to enroll in',
  })
  @ApiCreatedResponse({
    description: 'Enrollment created successfully.',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  @ApiForbiddenResponse({ description: 'Only students can enroll in courses.' })
  @ApiNotFoundResponse({ description: 'Course not found.' })
  @ApiConflictResponse({
    description: 'Student is already enrolled in this course.',
  })
  createEnrollment(
    @CurrentUser('id') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.enrollmentService.createEnrollment(userId, courseId);
  }

  //@route   Get ~/enrollments/my-courses
  @Get('my-courses')
  @ApiOperation({
    summary: 'Get my enrolled courses',
    description:
      'Returns all course enrollments for the currently authenticated student.',
  })
  @ApiOkResponse({
    description: 'List of enrollments retrieved successfully.',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  @ApiForbiddenResponse({
    description: 'Only students can access their enrollments.',
  })
  getMyEnrollments(@CurrentUser('id') userId: string) {
    return this.enrollmentService.findStudentEnrollments(userId);
  }
}
