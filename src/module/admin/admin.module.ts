import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CourseModule } from '../course/course.module';
import { EnrollmentModule } from '../enrollments/enrollment.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [CourseModule, EnrollmentModule, UserModule],
})
export class AdminModule {}
