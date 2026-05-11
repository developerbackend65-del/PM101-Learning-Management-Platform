import {
  Controller,
  Get,
  Param,
  HttpStatus,
  HttpCode,
  UseGuards,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { LessonService } from './lesson.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/decorators/role.decorator';
import { UserRole } from '../../../generated/prisma/enums';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@ApiBearerAuth()
@ApiTags('Lessons')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('course/:courseId/lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get(':lessonId')
  @Roles(UserRole.STUDENT)
  @ApiOperation({
    summary: 'Get a lesson by ID',
    description: 'Retrieves a specific lesson within a course by its ID.',
  })
  @ApiParam({
    name: 'courseId',
    description: 'The unique identifier of the course',
  })
  @ApiParam({
    name: 'lessonId',
    description: 'The unique identifier of the lesson',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lesson retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Course or lesson not found.',
  })
  async findOne(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @CurrentUser('id') studentId: string,
  ) {
    return this.lessonService.findOne(courseId, lessonId, studentId);
  }

  @Post(':lessonId/completed')
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Complete a lesson',
    description:
      'Marks a lesson as completed for the authenticated student and recalculates course progress.',
  })
  @ApiParam({
    name: 'courseId',
    description: 'The unique identifier of the course',
  })
  @ApiParam({
    name: 'lessonId',
    description: 'The unique identifier of the lesson to complete',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lesson marked as completed successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Course or lesson not found.',
  })
  @ApiForbiddenResponse({
    description: 'Student is not enrolled in this course.',
  })
  async completeLesson(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @CurrentUser('id') studentId: string,
  ) {
    return this.lessonService.completeLesson(lessonId, courseId, studentId);
  }
}
