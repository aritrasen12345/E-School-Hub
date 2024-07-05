import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  // * METHOD TO SEND EMAIL
  async sendEmail(to: string, subject: string, html: string) {
    this.logger.debug('Inside sendEmail!');

    const mailOptions: ISendMailOptions = {
      from: this.configService.get<string>('EMAIL_ID'),
      to,
      html,
      sender: 'e-school-hub',
      subject,
    };

    return this.mailerService.sendMail(mailOptions);
  }
}
