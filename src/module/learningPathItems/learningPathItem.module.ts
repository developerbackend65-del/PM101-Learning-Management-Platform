import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { LearningPathItemRepository } from './learningPathItem.repository';

@Module({
  providers: [LearningPathItemRepository],
  imports: [DatabaseModule],
  exports: [LearningPathItemRepository],
})
export class LearningPathItemModule {}
