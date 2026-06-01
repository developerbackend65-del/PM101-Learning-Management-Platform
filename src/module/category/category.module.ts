import { Module } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AdminCategoryController } from './admin-category.controller';
import { DatabaseModule } from '../db/database.module';

@Module({
  providers: [CategoryRepository, CategoryService],
  controllers: [CategoryController, AdminCategoryController],
  imports: [DatabaseModule],
})
export class CategoryModule {}
