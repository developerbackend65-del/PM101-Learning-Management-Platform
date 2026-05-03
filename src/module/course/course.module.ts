import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CourseRepository } from './course.repository';
import { DatabaseModule } from '../db/database.module';

@Module({
  controllers: [CourseController],
  providers: [CourseService, CourseRepository],
  imports: [DatabaseModule],
})
export class CourseModule {}
