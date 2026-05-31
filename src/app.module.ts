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
import { QuestionModule } from './module/questions/question.module';
import { AssessmentModule } from './module/assessments/assessment.module';
import { AssessmentSubmissionModule } from './module/assessmentSubmission/assessmentSubmission.module';
import { AdminModule } from './module/admin/admin.module';
import { CategoryModule } from './module/category/category.module';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';

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
    QuestionModule,
    AssessmentModule,
    AssessmentSubmissionModule,
    AdminModule,
    CategoryModule,
    CloudinaryModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
