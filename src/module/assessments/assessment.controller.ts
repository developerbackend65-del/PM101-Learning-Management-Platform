import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/decorators/role.decorator';
import { UserRole } from 'generated/prisma/enums';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assessments')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Post()
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Create a new assessment (Admin only)' })
  @ApiResponse({ status: 201, description: 'Assessment created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - missing or conflicting courseId/moduleId',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admins only' })
  create(@Body() dto: CreateAssessmentDto) {
    return this.assessmentService.create(dto);
  }

  @Get(':id/take')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get an assessment to take (Student only)' })
  @ApiParam({ name: 'id', description: 'Assessment ID' })
  @ApiResponse({
    status: 200,
    description: 'Assessment data returned (without correct answers)',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not enrolled in the course',
  })
  @ApiResponse({ status: 404, description: 'Assessment not found' })
  takeAssessment(
    @Param('id') assessmentId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.assessmentService.takeAssessment(assessmentId, userId);
  }

  @Post(':id/submit')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Submit answers for an assessment (Student only)' })
  @ApiParam({ name: 'id', description: 'Assessment ID' })
  @ApiResponse({
    status: 201,
    description: 'Submission result with score, passed status, and breakdown',
  })
  @ApiResponse({ status: 404, description: 'Assessment or question not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Students only' })
  submitAssessment(
    @Param('id') assessmentId: string,
    @Body() dto: SubmitAssessmentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.assessmentService.submitAssessment(assessmentId, userId, dto);
  }
}
