import { Injectable } from '@nestjs/common';
import { PermissionRepository } from './permission.repository';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepo: PermissionRepository) {}

  /**
   * Retrieves a list of all available permissions.
   *
   * @returns List of all permissions
   *
   * @example
   * await getAllPermission();
   * // { data: [{ id: 'clx1...', name: 'manage_users', description: '...' }] }
   */
  async getAllPermission() {
    const permissions = await this.permissionRepo.findAll();

    return {
      data: permissions,
    };
  }
}
