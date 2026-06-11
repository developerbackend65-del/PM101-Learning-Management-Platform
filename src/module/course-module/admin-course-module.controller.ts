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
import { CourseModuleService } from './course-module.service';
import { CreateModuleDto } from './dto/create-course-module.dto';
import { UpdateModuleDto } from './dto/update-course-module.dto';
import { ReorderModuleDto } from './dto/reorder-course-module.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { Roles } from 'src/shared/decorators/role.decorator';
import { UserRole } from '../../../generated/prisma/enums';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { PermissionGuard } from 'src/shared/guards/permission.guard';
import { RequirePermission } from 'src/shared/decorators/require-permission.decorator';

@ApiTags('Admin — Modules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@Controller('admin')
export class AdminCourseModuleController {
  constructor(private readonly courseModuleService: CourseModuleService) {}

  @Post('courses/:courseId/modules')
  @RequirePermission('manage_content')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a module',
    description:
      'Creates a new module under the specified course. Requires Admin role.',
  })
  @ApiParam({
    name: 'courseId',
    description: 'The ID of the course to add the module to',
    type: String,
  })
  @ApiBody({ type: CreateModuleDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Module created successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Course not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient role permissions',
  })
  createModule(
    @Param('courseId') courseId: string,
    @Body() dto: CreateModuleDto,
  ) {
    return this.courseModuleService.createModule(courseId, dto);
  }

  @Patch('modules/:moduleId')
  @RequirePermission('manage_content')
  @ApiOperation({
    summary: 'Update a module',
    description:
      'Updates the fields of an existing module by its ID. Requires Admin role.',
  })
  @ApiParam({
    name: 'moduleId',
    description: 'The ID of the module to update',
    type: String,
  })
  @ApiBody({ type: UpdateModuleDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Module updated successfully',
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
  updateModule(
    @Param('moduleId') moduleId: string,
    @Body() dto: UpdateModuleDto,
  ) {
    return this.courseModuleService.updateModule(moduleId, dto);
  }

  @Delete('modules/:moduleId')
  @RequirePermission('manage_content')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a module',
    description: 'Permanently deletes a module by its ID. Requires Admin role.',
  })
  @ApiParam({
    name: 'moduleId',
    description: 'The ID of the module to delete',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Module deleted successfully',
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
  deleteModule(@Param('moduleId') moduleId: string) {
    return this.courseModuleService.deleteModule(moduleId);
  }

  @Patch('modules/:moduleId/reorder')
  @RequirePermission('manage_content')
  @ApiOperation({
    summary: 'Reorder a module',
    description:
      'Updates the position/order of a module within its course. Requires Admin role.',
  })
  @ApiParam({
    name: 'moduleId',
    description: 'The ID of the module to reorder',
    type: String,
  })
  @ApiBody({ type: ReorderModuleDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Module reordered successfully',
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
  reorderModule(
    @Param('moduleId') moduleId: string,
    @Body() dto: ReorderModuleDto,
  ) {
    return this.courseModuleService.reorderModule(moduleId, dto);
  }
}
