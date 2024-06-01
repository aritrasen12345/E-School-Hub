import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './modules/tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseAsyncConfig } from './config/db/mongoose.config';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
