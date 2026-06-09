import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { Prisma } from '../../../generated/prisma/client';

@Injectable()
export class CourseModuleRepository {
  constructor(private prisma: DatabaseService) {}

  create(data: Prisma.CourseModuleCreateInput) {
    return this.prisma.courseModule.create({ data });
  }

  update(data: Prisma.CourseModuleUpdateInput, id: string) {
    return this.prisma.courseModule.update({
      where: { id },
      data,
    });
  }

  findOne(id: string) {
    return this.prisma.courseModule.findUnique({
      where: { id },
    });
  }

  delete(id: string) {
    return this.prisma.courseModule.delete({
      where: { id },
    });
  }
}
