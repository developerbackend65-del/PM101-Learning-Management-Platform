import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'generated/prisma/enums';
import { AdminPermissionRepository } from 'src/module/admin-permission/admin-permission.repository';
import { PERMISSION_KEY } from '../decorators/require-permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly adminPermissionRepo: AdminPermissionRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Access denied: no user found in request');
    }

    if (user.role !== UserRole.ADMIN) return true;

    const permission = await this.adminPermissionRepo.findByAdminId(
      user.id,
      requiredPermission,
    );

    if (!permission) {
      throw new ForbiddenException(
        `You do not have permission to perform this action: ${requiredPermission}`,
      );
    }

    return true;
  }
}
