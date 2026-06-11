import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/decorators/role.decorator';
import { CreateLearningPathDto } from './dto/create-learnPath.dto';
import { UserRole } from '../../../generated/prisma/client';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { LearningPathService } from './learningPath.service';
import { PermissionGuard } from 'src/shared/guards/permission.guard';
import { RequirePermission } from 'src/shared/decorators/require-permission.decorator';

@UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard)
@ApiBearerAuth()
@Controller('learning-paths')
export class LearningPathsController {
  constructor(private readonly learningPathsService: LearningPathService) {}

  //@route   Post ~/learning-paths
  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @RequirePermission('manage_learning_paths')
  @ApiOperation({
    summary: 'Create a learning path',
    description:
      'Creates a new learning path with ordered courses. Accessible by admins only.',
  })
  @ApiResponse({
    status: 201,
    description: 'Learning path created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or duplicate course IDs in the request body',
  })
  @ApiResponse({
    status: 401,
    description: 'Missing or invalid JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Authenticated user does not have the Admin role',
  })
  async createLearningPath(
    @Body() dto: CreateLearningPathDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.learningPathsService.create(dto, userId);
  }

  // GET /learning-paths?page=1&limit=10
  @Get()
  @Roles(UserRole.STUDENT)
  @ApiOperation({
    summary: 'Get all learning paths',
    description:
      'Returns a paginated list of learning paths. Accessible by students only.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of learning paths returned successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Missing or invalid JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Authenticated user does not have the Student role',
  })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.learningPathsService.findAllPath(page, limit);
  }

  // GET /learning-paths/:id
  @Get(':id')
  @Roles(UserRole.STUDENT)
  @ApiOperation({
    summary: 'Get a learning path by ID',
    description:
      'Returns a single learning path with ordered courses and enrollment status per course. Accessible by students only.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The unique identifier of the learning path',
  })
  @ApiResponse({
    status: 200,
    description: 'Learning path returned successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Missing or invalid JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Authenticated user does not have the Student role',
  })
  @ApiResponse({
    status: 404,
    description: 'Learning path not found',
  })
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.learningPathsService.findOne(id, userId);
  }
}
