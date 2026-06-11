import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { Prisma } from 'generated/prisma/browser';
import { TransactionClient } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class AdminPermissionRepository {
  constructor(private readonly prisma: DatabaseService) {}

  create(data: Prisma.AdminPermissionCreateInput, tx?: TransactionClient) {
    const client = tx ?? this.prisma;
    return client.adminPermission.create({ data });
  }

  upsert(
    adminId: string,
    permissionId: string,
    granted: boolean,
    tx?: TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.adminPermission.upsert({
      where: { adminId_permissionId: { adminId, permissionId } },
      update: { granted },
      create: { adminId, permissionId, granted },
    });
  }

  findByAdminId(adminId: string, name: string) {
    return this.prisma.adminPermission.findFirst({
      where: {
        adminId,
        permission: {
          name,
        },
        granted: true,
      },
    });
  }

  deleteMany(adminId: string, tx?: TransactionClient) {
    const client = tx ?? this.prisma;
    return client.adminPermission.deleteMany({
      where: { adminId },
    });
  }
}
