import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { ApiQuery, ApiParam, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all courses with pagination and search' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  public async allCourse(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.courseService.getAllCourses(page, limit, search);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Course found successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
  })
  public getCourseById(@Param('id') id: string) {
    return this.courseService.getCourseById(id);
  }
}
