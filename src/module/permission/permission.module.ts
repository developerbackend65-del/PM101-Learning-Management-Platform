import { Module } from '@nestjs/common';
import { PermissionRepository } from './permission.repository';
import { PermissionService } from './permission.service';
import { PermissionsController } from './permission.controller';
import { DatabaseModule } from '../db/database.module';

@Module({
  providers: [PermissionRepository, PermissionService],
  controllers: [PermissionsController],
  imports: [DatabaseModule],
  exports: [PermissionRepository],
})
export class PermissionModule {}
