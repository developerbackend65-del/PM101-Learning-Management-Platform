import { Module } from '@nestjs/common';
import { CourseModuleRepository } from './course-module.repository';
import { CourseModuleService } from './course-module.service';
import { AdminCourseModuleController } from './admin-course-module.controller';
import { DatabaseModule } from '../db/database.module';
import { CourseModule } from '../course/course.module';

@Module({
  providers: [CourseModuleRepository, CourseModuleService],
  controllers: [AdminCourseModuleController],
  imports: [DatabaseModule, CourseModule],
  exports: [CourseModuleRepository],
})
export class CourseModuleModule {}
