import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseModuleRepository } from './course-module.repository';
import { CreateModuleDto } from './dto/create-course-module.dto';
import { CourseRepository } from '../course/course.repository';
import { UpdateModuleDto } from './dto/update-course-module.dto';
import { ReorderModuleDto } from './dto/reorder-course-module.dto';

@Injectable()
export class CourseModuleService {
  constructor(
    private courseModuleRepo: CourseModuleRepository,
    private courseRepo: CourseRepository,
  ) {}

  /**
   * Creates a new module within a specified course.
   *
   * @param courseId - The ID of the course to add the module to
   * @param dto - The module creation data transfer object
   * @returns An object containing a success message and the created module under the `data` key
   * @throws {NotFoundException} If the course with the given ID does not exist
   */
  async createModule(courseId: string, dto: CreateModuleDto) {
    const course = await this.courseRepo.findById(courseId);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const module = await this.courseModuleRepo.create({
      ...dto,
      course: { connect: { id: courseId } },
    });

    return {
      message: 'Module created successfully',
      data: module,
    };
  }

  /**
   * Updates an existing module by ID.
   *
   * @param moduleId - The ID of the module to update
   * @param dto - The module update data transfer object
   * @returns An object containing a success message and the updated module under the `data` key
   * @throws {NotFoundException} If the module with the given ID does not exist
   */
  async updateModule(moduleId: string, dto: UpdateModuleDto) {
    const module = await this.courseModuleRepo.findOne(moduleId);

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const updatedModule = await this.courseModuleRepo.update(dto, moduleId);

    return {
      message: 'Module updated successfully',
      data: updatedModule,
    };
  }

  /**
   * Deletes a module by ID.
   *
   * @param moduleId - The ID of the module to delete
   * @returns An object containing a success message
   * @throws {NotFoundException} If the module with the given ID does not exist
   */
  async deleteModule(moduleId: string) {
    const module = await this.courseModuleRepo.findOne(moduleId);

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    await this.courseModuleRepo.delete(moduleId);

    return {
      message: 'Module deleted successfully',
    };
  }

  /**
   * Updates the order/position of a module within its course.
   *
   * @param moduleId - The ID of the module to reorder
   * @param dto - The reorder data transfer object containing the new position
   * @returns An object containing a success message and the updated module under the `data` key
   * @throws {NotFoundException} If the module with the given ID does not exist
   */
  async reorderModule(moduleId: string, dto: ReorderModuleDto) {
    const module = await this.courseModuleRepo.findOne(moduleId);

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const updatedModule = await this.courseModuleRepo.update(dto, moduleId);

    return {
      message: 'Module reordered successfully',
      data: updatedModule,
    };
  }
}
