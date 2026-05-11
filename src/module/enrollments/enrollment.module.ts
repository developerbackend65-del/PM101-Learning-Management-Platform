import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentRepository } from './enrollment.repository';
import { DatabaseModule } from '../db/database.module';
import { CourseModule } from '../course/course.module';

@Module({
  providers: [EnrollmentService, EnrollmentRepository],
  controllers: [EnrollmentController],
  imports: [DatabaseModule, CourseModule],
})
export class EnrollmentModule {}
