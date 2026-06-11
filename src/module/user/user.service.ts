import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateUserDto } from './dto/user-update.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  /**
   * Updates a user's profile information.
   *
   * @param id - The unique identifier of the user to update
   * @param dto - The data transfer object containing the fields to update
   * @returns An object containing a success message and the updated user data
   */
  public async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.userRepo.updateUser(id, dto);

    return {
      message: 'update successful',
      data: user,
    };
  }

  /**
   * Changes the password for an existing user.
   *
   * Verifies the user exists and that the provided old password matches
   * the stored hash before hashing and saving the new password.
   *
   * @param id - The unique identifier of the user
   * @param dto - The data transfer object containing `oldPassword` and `newPassword`
   * @returns An object containing a success message
   * @throws {NotFoundException} If no user is found with the given ID
   * @throws {BadRequestException} If the old password does not match the stored hash
   */
  public async changePassword(id: string, dto: ChangePasswordDto) {
    const { oldPassword, newPassword } = dto;

    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    const Hpass = await bcrypt.hash(newPassword, 10);
    await this.userRepo.updatePassword(id, Hpass);

    return {
      message: 'Password changed successfully',
    };
  }

  /**
   * Permanently deletes a user account.
   *
   * Verifies the user exists before performing the deletion.
   *
   * @param id - The unique identifier of the user to delete
   * @returns An object containing a success message
   * @throws {NotFoundException} If no user is found with the given ID
   */
  public async deleteAccount(id: string) {
    const user = await this.userRepo.getUser(id);

    if (!user) {
      throw new NotFoundException(`User with this ID not found`);
    }

    await this.userRepo.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
