import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './modules/tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseAsyncConfig } from './config/db/mongoose.config';
import { StudentModule } from './modules/student/student.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './common/filters';

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

    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
