// dto/update-permissions.dto.ts
import { IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class PermissionItemDto {
  @ApiProperty({ description: 'Permission ID' })
  @IsString()
  permissionId: string;

  @ApiProperty({
    description: 'Grant or revoke this permission',
  })
  @IsBoolean()
  granted: boolean;
}

export class UpdatePermissionsDto {
  @ApiProperty({
    type: [PermissionItemDto],
    description: 'List of permissions with their granted status',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PermissionItemDto)
  permissions: PermissionItemDto[];
}
