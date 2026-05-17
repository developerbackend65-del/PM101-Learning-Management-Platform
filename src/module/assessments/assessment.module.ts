import { Module } from '@nestjs/common';
import { AssessmentRepository } from './assessment.repository';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { DatabaseModule } from '../db/database.module';
import { QuestionModule } from '../questions/question.module';
import { EnrollmentModule } from '../enrollments/enrollment.module';
import { AssessmentSubmissionModule } from '../assessmentSubmission/assessmentSubmission.module';

@Module({
  providers: [AssessmentRepository, AssessmentService],
  controllers: [AssessmentController],
  imports: [
    DatabaseModule,
    QuestionModule,
    EnrollmentModule,
    AssessmentSubmissionModule,
  ],
})
export class AssessmentModule {}
