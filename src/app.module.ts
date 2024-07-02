import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './modules/tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseAsyncConfig } from './config/db/mongoose.config';
import { StudentModule } from './modules/student/student.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionFilter } from './common/filters';
import { ResponseInterceptor } from './common/interceptors';
import { MailModule } from './modules/mail/mail.module';
import { SchoolModule } from './modules/school/school.module';
import { StandardModule } from './modules/section/standard.module';

@Module({
  imports: [
    // * IMPORT CONFIG MODULE
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    // * IMPORT MONGOOSE MODULE
    MongooseModule.forRootAsync(mongooseAsyncConfig),

    // * IMPORT TASK MODULE
    TasksModule,

    // * IMPORT CUSTOM MODULE
    StudentModule,

    // * IMPORT AUTH MODULE
    AuthModule,

    // * IMPORT MAIL MODULE
    MailModule,

    // * IMPORT SCHOOL MODULE
    SchoolModule,

    // * IMPORT STANDARD MODULE
    StandardModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
