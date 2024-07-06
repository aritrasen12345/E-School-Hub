import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

export class AuthUtil {
  private readonly logger = new Logger(AuthUtil.name);

  constructor(private readonly configService: ConfigService) {}

  // * METHOD TO VERIFY SCHOOL TOKEN
  async verifySchoolJWT(token: string): Promise<string> {
    this.logger.debug('Inside verifySchoolJWT!');

    // * VERIFY THE TOKEN
    const payload = jwt.verify(
      token,
      this.configService.get<string>('CREATED_SCHOOL_SECRET_KEY'),
    );

    const schoolId = payload['id'];

    if (!schoolId) {
      throw new UnauthorizedException('Invalid link!');
    }

    return schoolId;
  }

  // * METHOD TO VALIDATE
  async verifyResetPasswordJWT(token: string): Promise<string> {
    this.logger.debug('Inside verifyResetPasswordJWT!');

    // * VERIFY FORGET_PASSWORD
    const payload = jwt.verify(
      token,
      this.configService.get<string>('FORGET_PASSWORD_SECRET_KEY'),
    );

    const schoolId = payload['id'];

    if (!schoolId) {
      throw new UnauthorizedException('Invalid Link!');
    }

    return schoolId;
  }
}
