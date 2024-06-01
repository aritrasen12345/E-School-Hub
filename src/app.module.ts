import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './modules/tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // * Import config module
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    // * Import TaskModule
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
