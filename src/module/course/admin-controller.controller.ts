import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { Roles } from 'src/shared/decorators/role.decorator';
import { UserRole } from 'generated/prisma/enums';

const fileInterceptor = FileInterceptor('thumbnail', {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(UserRole.Admin)
@ApiTags('Admin - Courses')
@Controller('admin/courses')
export class AdminCourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseInterceptors(fileInterceptor)
  @ApiOperation({ summary: 'Create a new course with a thumbnail image' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'Course created successfully.' })
  @ApiInternalServerErrorResponse({ description: 'Image upload failed.' })
  async createCourse(
    @Body() dto: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') adminId: string,
  ) {
    return this.courseService.createCourse(dto, adminId, file);
  }

  @Patch(':id')
  @UseInterceptors(fileInterceptor)
  @ApiOperation({ summary: 'Update an existing course by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ description: 'Course updated successfully.' })
  @ApiNotFoundResponse({ description: 'Course not found.' })
  async updateCourse(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') adminId: string,
  ) {
    return this.courseService.updateCourse(dto, adminId, id, file);
  }
}
