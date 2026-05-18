import { Module } from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { DatabaseModule } from '../db/database.module';

@Module({
  providers: [QuestionRepository],
  imports: [DatabaseModule],
  exports: [QuestionRepository],
})
export class QuestionModule {}
