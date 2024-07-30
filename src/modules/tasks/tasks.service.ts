import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Cron('0 */12 * * *')
  async handleCron() {
    this.logger.debug('Called when the current hour is 12');
    const response = await this.httpService.axiosRef.get<string>(
      this.configService.get('BACKEND_BASE_URL'),
    );

    response
      ? this.logger.log('Ping Successful!')
      : this.logger.log('Error pinging server!');
  }
}
