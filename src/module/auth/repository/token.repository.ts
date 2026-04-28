import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TransactionClient } from 'generated/prisma/internal/prismaNamespace';
import { DatabaseService } from 'src/module/db/database.service';

@Injectable()
export class TokenRepository {
  constructor(private readonly prisma: DatabaseService) {}

  findByToken(token: string) {
    return this.prisma.token.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  create(data: Prisma.TokenCreateInput, tx?: TransactionClient) {
    const client = tx ?? this.prisma;
    return client.token.create({ data });
  }

  used(token: string, tx?: TransactionClient) {
    const client = tx ?? this.prisma;

    return client.token.update({
      where: { token },
      data: { used: true },
    });
  }
}
