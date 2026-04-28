import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../db/database.module';
import { TokenRepository } from './repository/token.repository';
import { OutboxRepository } from './repository/outbox.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [AuthService, TokenRepository, OutboxRepository, JwtStrategy],
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: config.get<string>(
              'JWT_ACCESS_EXPIRES_IN',
            ) as StringValue,
          },
        };
      },
    }),
    UserModule,
    DatabaseModule,
  ],
  exports: [OutboxRepository],
})
export class AuthModule {}
