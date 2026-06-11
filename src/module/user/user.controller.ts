import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user-update.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { Roles } from 'src/shared/decorators/role.decorator';
import { UserRole } from 'generated/prisma/enums';

@ApiTags('Users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
@ApiForbiddenResponse({ description: 'Insufficient role permissions' })
@UseGuards(JwtAuthGuard)
@Roles(UserRole.STUDENT)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Update user profile',
    description: 'Updates the profile fields of an existing user.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    description: 'User updated successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Patch(':id')
  public async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }

  @ApiOperation({
    summary: 'Change user password',
    description:
      'Verifies the old password and replaces it with a new hashed password.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse({
    description: 'Password changed successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Old password is incorrect' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id/change-password')
  public async changePassword(
    @Param('id') id: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(id, dto);
  }

  @ApiOperation({
    summary: 'Delete user account',
    description:
      'Permanently deletes the user account associated with the given ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user',
  })
  @ApiOkResponse({
    description: 'User deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  public async deleteAccount(@Param('id') id: string) {
    return this.userService.deleteAccount(id);
  }
}
