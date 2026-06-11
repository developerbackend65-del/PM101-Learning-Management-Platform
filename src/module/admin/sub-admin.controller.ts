import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  Delete,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CreateSubAdminDto } from './dto/create-sub-admin.dto';
import { AdminService } from './admin.service';
import { UpdatePermissionsDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/decorators/role.decorator';
import { UserRole } from 'generated/prisma/enums';

@ApiTags('Admin - Sub Admins')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller('admin/sub-admins')
export class SubAdminsController {
  constructor(private readonly adminsService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sub-admin with permissions' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sub-admin created successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already in use',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'One or more permission IDs are invalid',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Super Admin only',
  })
  create(@Body() dto: CreateSubAdminDto) {
    return this.adminsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all active sub-admins with their permissions',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of sub-admins returned successfully',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Super Admin only',
  })
  findAll() {
    return this.adminsService.findAll();
  }

  @Patch(':id/permissions')
  @ApiOperation({ summary: 'Update permissions of a specific sub-admin' })
  @ApiParam({ name: 'id', description: 'Sub-admin user ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permissions updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sub-admin not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'One or more permission IDs are invalid',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Super Admin only',
  })
  updatePermissions(
    @Param('id') id: string,
    @Body() dto: UpdatePermissionsDto,
  ) {
    return this.adminsService.updatePermissions(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke admin access from a sub-admin' })
  @ApiParam({ name: 'id', description: 'Sub-admin user ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sub-admin revoked successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sub-admin not found',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Super Admin only',
  })
  remove(@Param('id') id: string) {
    return this.adminsService.remove(id);
  }
}
