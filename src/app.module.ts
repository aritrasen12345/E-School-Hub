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

@Module({
  imports: [
    // * Import config module
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    // * Import Mongoose Module
    MongooseModule.forRootAsync(mongooseAsyncConfig),

    // * Import TaskModule
    TasksModule,

    // * Import custom module
    StudentModule,

    // * Import Auth module
    AuthModule,

    // * IMPORT MAIL MODULE
    MailModule,
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
