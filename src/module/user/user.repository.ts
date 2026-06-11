import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { Prisma, USER_STATUS, UserRole } from 'generated/prisma/client';
import { TransactionClient } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: DatabaseService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  createUser(data: Prisma.UserCreateInput, tx?: TransactionClient) {
    const client = tx ?? this.prisma;
    return client.user.create({ data });
  }

  verify(id: string, tx?: TransactionClient) {
    const client = tx ?? this.prisma;

    return client.user.update({
      where: { id },
      data: { is_verified: true },
    });
  }

  updatePassword(id: string, password: string, tx?: TransactionClient) {
    const client = tx ?? this.prisma;

    return client.user.update({
      where: { id },
      data: { password_hash: password },
    });
  }

  updateRefreshToken(id: string, refreshToken: string) {
    return this.prisma.user.update({
      where: { id },
      data: { refresh_token_hash: refreshToken, lastActiveAt: new Date() },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        adminPermissions: true,
      },
    });
  }

  restoreAccount(id: string, tx?: TransactionClient) {
    const client = tx ?? this.prisma;

    return client.user.update({
      where: { id },
      data: { status: USER_STATUS.Active, deleted_at: null },
    });
  }

  countAllUsers() {
    return this.prisma.user.count();
  }

  activeUserLast30Days() {
    const last30Days = new Date();

    last30Days.setDate(last30Days.getDate() - 30);

    return this.prisma.user.count({
      where: {
        lastActiveAt: {
          gte: last30Days,
        },
      },
    });
  }

  async getUsers(
    page: number = 1,
    limit: number = 20,
    search?: string,
    role?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(role && { role: role.toUpperCase() as UserRole }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        omit: {
          password_hash: true,
          refresh_token_hash: true,
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
    ]);

    return {
      users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  getUser(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        password_hash: true,
        refresh_token_hash: true,
      },
      include: {
        enrollments: true,
      },
    });
  }

  banUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        status: USER_STATUS.Ban,
        bannedAt: new Date(),
      },
      omit: {
        password_hash: true,
        refresh_token_hash: true,
      },
    });
  }

  unbanUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        status: USER_STATUS.Active,
        bannedAt: null,
      },
      omit: {
        password_hash: true,
        refresh_token_hash: true,
      },
    });
  }

  deleteUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        status: USER_STATUS.Delete,
        deleted_at: new Date(),
      },
    });
  }

  updateUser(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
      omit: {
        password_hash: true,
        refresh_token_hash: true,
      },
    });
  }

  allAdmin() {
    return this.prisma.user.findMany({
      where: {
        role: UserRole.ADMIN,
      },
      include: {
        adminPermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  delete(id: string, tx?: TransactionClient) {
    const client = tx ?? this.prisma;
    return client.user.delete({ where: { id } });
  }
}
