import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { Prisma } from 'generated/prisma/browser';

@Injectable()
export class CategoryRepository {
  constructor(private prisma: DatabaseService) {}

  // CREATE
  create(data: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({
      data,
    });
  }

  // FIND ALL
  findAll() {
    return this.prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // FIND ONE
  findOneById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        courses: true,
      },
    });
  }

  findOneByName(name: string) {
    return this.prisma.category.findUnique({
      where: { name },
    });
  }

  // UPDATE
  update(id: string, data: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  // DELETE
  remove(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
