import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/decorators/role.decorator';
import { CreateLearningPathDto } from './dto/create-learnPath.dto';
import { UserRole } from '../../../generated/prisma/client';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LearningPathService } from './learningPath.service';

@Controller('learning-paths')
export class LearningPathsController {
  constructor(private readonly learningPathsService: LearningPathService) {}

  //@route   Post ~/learning-paths
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth()
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
}
