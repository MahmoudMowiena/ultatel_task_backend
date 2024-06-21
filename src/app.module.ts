import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { DatabaseModule } from './database/database.module';


@Module({
  imports: [
    AuthModule, 
    UserModule,
    StudentModule,
    DatabaseModule,
  ],
})

export class AppModule {}
