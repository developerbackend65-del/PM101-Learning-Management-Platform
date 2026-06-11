import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CourseRepository } from './course.repository';
import { DatabaseModule } from '../db/database.module';
import { AdminCourseController } from './admin-course.controller';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { AdminPermissionModule } from '../admin-permission/admin-permission.module';

@Module({
  controllers: [CourseController, AdminCourseController],
  providers: [CourseService, CourseRepository],
  imports: [DatabaseModule, CloudinaryModule, AdminPermissionModule],
  exports: [CourseRepository],
})
export class CourseModule {}
