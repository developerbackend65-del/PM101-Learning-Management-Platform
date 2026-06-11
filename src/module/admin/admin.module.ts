import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CourseModule } from '../course/course.module';
import { EnrollmentModule } from '../enrollments/enrollment.module';
import { UserModule } from '../user/user.module';
import { SubAdminsController } from './sub-admin.controller';
import { AdminPermissionModule } from '../admin-permission/admin-permission.module';
import { PermissionModule } from '../permission/permission.module';
import { DatabaseModule } from '../db/database.module';

@Module({
  controllers: [AdminController, SubAdminsController],
  providers: [AdminService],
  imports: [
    CourseModule,
    EnrollmentModule,
    UserModule,
    AdminPermissionModule,
    PermissionModule,
    DatabaseModule,
  ],
})
export class AdminModule {}
