import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

/**
 * Service responsible for handling category business logic.
 * Delegates data access to {@link CategoryRepository}.
 */
@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  /**
   * Creates a new category.
   *
   * @param dto - The data required to create a category.
   * @returns The created category with a success message.
   * @throws {ConflictException} If a category with the same name already exists.
   */
  async create(dto: CreateCategoryDto) {
    const exists = await this.categoryRepo.findOneByName(dto.name);
    if (exists) {
      throw new ConflictException('Category already exists');
    }
    const category = await this.categoryRepo.create(dto);
    return { message: 'Category created successfully', data: category };
  }

  /**
   * Retrieves all categories.
   *
   * @returns A list of all categories.
   */
  async findAll() {
    const categories = await this.categoryRepo.findAll();
    return { data: categories };
  }

  /**
   * Retrieves a single category by its ID.
   *
   * @param id - The unique identifier of the category.
   * @returns The category matching the given ID.
   * @throws {NotFoundException} If no category with the given ID exists.
   */
  async findOne(id: string) {
    const category = await this.categoryRepo.findOneById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return { data: category };
  }

  /**
   * Updates an existing category by its ID.
   *
   * @param id - The unique identifier of the category to update.
   * @param dto - The data to update the category with.
   * @returns The updated category with a success message.
   * @throws {NotFoundException} If no category with the given ID exists.
   */
  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    const category = await this.categoryRepo.update(id, dto);
    return { message: 'Category updated successfully', data: category };
  }

  /**
   * Removes a category by its ID.
   *
   * @param id - The unique identifier of the category to delete.
   * @returns A success message confirming deletion.
   * @throws {NotFoundException} If no category with the given ID exists.
   */
  async remove(id: string) {
    await this.findOne(id);
    await this.categoryRepo.remove(id);
    return { message: 'Category deleted successfully' };
  }
}
