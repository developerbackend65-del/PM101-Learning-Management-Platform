import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { DatabaseModule } from '../db/database.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  providers: [UserRepository, UserService],
  controllers: [UserController],
  imports: [DatabaseModule],
  exports: [UserRepository],
})
export class UserModule {}
