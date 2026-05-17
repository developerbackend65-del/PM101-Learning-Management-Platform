import { Module } from '@nestjs/common';
import { AssessmentSubmissionRepository } from './assessmentSubmission.repository';
import { DatabaseModule } from '../db/database.module';

@Module({
  providers: [AssessmentSubmissionRepository],
  imports: [DatabaseModule],
  exports: [AssessmentSubmissionRepository],
})
export class AssessmentSubmissionModule {}
