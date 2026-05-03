import { Module } from '@nestjs/common';
import { DatabaseModule } from './module/db/database.module';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from './shared/mail/mail.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { CourseModule } from './module/course/course.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    MailModule,
    CourseModule,
    SchedulerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
