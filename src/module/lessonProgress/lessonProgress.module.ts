import { Module } from '@nestjs/common';
import { LessonProgressRepository } from './lessonProgress.repository';
import { DatabaseModule } from '../db/database.module';

@Module({
  providers: [LessonProgressRepository],
  imports: [DatabaseModule],
  exports: [LessonProgressRepository],
})
export class LessonProgressModule {}
