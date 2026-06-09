import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonRepository } from './lesson.repository';
import { LessonController } from './lesson.controller';
import { DatabaseModule } from '../db/database.module';
import { EnrollmentModule } from '../enrollments/enrollment.module';
import { LessonProgressModule } from '../lessonProgress/lessonProgress.module';
import { CourseModuleModule } from '../course-module/course-module.module';

@Module({
  providers: [LessonService, LessonRepository],
  controllers: [LessonController],
  imports: [
    DatabaseModule,
    EnrollmentModule,
    LessonProgressModule,
    CourseModuleModule,
  ],
})
export class LessonModule {}
