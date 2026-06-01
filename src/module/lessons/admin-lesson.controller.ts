import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ReorderLessonDto } from './dto/reorder-lesson.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { Roles } from 'src/shared/decorators/role.decorator';
import { UserRole } from '../../../generated/prisma/enums';

@ApiTags('Admin — Lessons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(UserRole.Admin)
@Controller('admin')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post('modules/:moduleId/lessons')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a lesson',
    description:
      'Creates a new lesson under the specified module. Requires Admin role.',
  })
  @ApiParam({
    name: 'moduleId',
    description: 'The ID of the module to add the lesson to',
    type: String,
  })
  @ApiBody({ type: CreateLessonDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Lesson created successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Module not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient role permissions',
  })
  createLesson(
    @Param('moduleId') moduleId: string,
    @Body() dto: CreateLessonDto,
  ) {
    return this.lessonService.createLesson(moduleId, dto);
  }

  @Patch('lessons/:id')
  @ApiOperation({
    summary: 'Update a lesson',
    description:
      'Updates the fields of an existing lesson by its ID. Requires Admin role.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the lesson to update',
    type: String,
  })
  @ApiBody({ type: UpdateLessonDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lesson updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Lesson not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient role permissions',
  })
  updateLesson(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonService.updateLesson(id, dto);
  }

  @Delete('lessons/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a lesson',
    description: 'Permanently deletes a lesson by its ID. Requires Admin role.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the lesson to delete',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lesson deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Lesson not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient role permissions',
  })
  deleteLesson(@Param('id') id: string) {
    return this.lessonService.deleteLesson(id);
  }

  @Patch('lessons/:id/reorder')
  @ApiOperation({
    summary: 'Reorder a lesson',
    description:
      'Updates the position/order of a lesson within its module. Requires Admin role.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the lesson to reorder',
    type: String,
  })
  @ApiBody({ type: ReorderLessonDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lesson reordered successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Lesson not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient role permissions',
  })
  reorderLesson(@Param('id') id: string, @Body() dto: ReorderLessonDto) {
    return this.lessonService.reorderLesson(id, dto);
  }
}
