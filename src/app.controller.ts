import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipResponseInterceptor } from './common/decorators';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get()
  @SkipResponseInterceptor()
  getHello(): string {
    this.logger.debug('Inside getHello!');
    return this.appService.getHello();
  }
}
