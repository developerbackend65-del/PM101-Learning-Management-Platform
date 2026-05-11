import { Module } from '@nestjs/common';
import { DatabaseModule } from './module/db/database.module';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from './shared/mail/mail.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { CourseModule } from './module/course/course.module';
import { EnrollmentModule } from './module/enrollments/enrollment.module';
import { LessonModule } from './module/lessons/lesson.module';
import { LessonProgressModule } from './module/lessonProgress/lessonProgress.module';
import { LearningPathItemModule } from './module/learningPathItems/learningPathItem.module';
import { LearningPathModule } from './module/learningPaths/learningPath.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    MailModule,
    CourseModule,
    EnrollmentModule,
    SchedulerModule,
    LearningPathItemModule,
    LearningPathModule,
    LessonProgressModule,
    LessonModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
