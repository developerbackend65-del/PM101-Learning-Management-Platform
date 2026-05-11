import { Module } from '@nestjs/common';
import { LearningPathService } from './learningPath.service';
import { LearningPathRepository } from './learningPath.repository';
import { LearningPathsController } from './learningPath.controller';
import { DatabaseModule } from '../db/database.module';
import { LearningPathItemModule } from '../learningPathItems/learningPathItem.module';

@Module({
  providers: [LearningPathService, LearningPathRepository],
  controllers: [LearningPathsController],
  imports: [DatabaseModule, LearningPathItemModule],
})
export class LearningPathModule {}
