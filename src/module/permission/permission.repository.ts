import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';

@Injectable()
export class PermissionRepository {
  constructor(private readonly prisma: DatabaseService) {}

  findAll() {
    return this.prisma.permission.findMany();
  }

  findWithIds(permissionIds: string[]) {
    return this.prisma.permission.findMany({
      where: { id: { in: permissionIds } },
    });
  }
}
