import { Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export class AuthUtil {
  private readonly logger = new Logger(AuthUtil.name);

  constructor(
    @Inject('CREATED_SCHOOL_JWT') private createdSchoolJwtService: JwtService,
    @Inject('FORGET_PASSWORD_JWT') private forgetPasswordJwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // * METHOD TO VERIFY SCHOOL TOKEN
  async verifySchoolJWT(token: string): Promise<string> {
    this.logger.debug('Inside verifySchoolJWT!');

    // * VERIFY THE TOKEN
    const { id: schoolId } = await this.createdSchoolJwtService.verifyAsync(
      token,
      {
        secret: this.configService.get<string>('CREATED_SCHOOL_SECRET_KEY'),
      },
    );

    if (!schoolId) {
      throw new UnauthorizedException('Invalid link!');
    }

    return schoolId;
  }

  // * METHOD TO VALIDATE
  async verifyResetPasswordJWT(token: string): Promise<string> {
    this.logger.debug('Inside verifyResetPasswordJWT!');

    // * VERIFY FORGET_PASSWORD
    const { id: schoolId } = await this.forgetPasswordJwtService.verifyAsync(
      token,
      {
        secret: this.configService.get<string>('FORGET_PASSWORD_SECRET_KEY'),
      },
    );

    if (!schoolId) {
      throw new UnauthorizedException('Invalid Link!');
    }

    return schoolId;
  }
}
