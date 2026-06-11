import { Module } from '@nestjs/common';
import { AdminPermissionRepository } from './admin-permission.repository';
import { DatabaseModule } from '../db/database.module';

@Module({
  providers: [AdminPermissionRepository],
  imports: [DatabaseModule],
  exports: [AdminPermissionRepository],
})
export class AdminPermissionModule {}
