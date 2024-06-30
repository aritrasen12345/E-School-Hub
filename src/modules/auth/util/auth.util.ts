import { Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class AuthUtil {
  private readonly logger = new Logger(AuthUtil.name);

  constructor(
    @Inject('CREATED_SCHOOL_JWT') private createdSchoolJwtService: JwtService,
    @Inject('FORGET_PASSWORD_JWT') private forgetPasswordJwtService: JwtService,
  ) {}

  // * METHOD TO VERIFY SCHOOL TOKEN
  async verifySchoolJWT(token: string): Promise<string> {
    this.logger.debug('Inside verifySchoolJWT!');

    // * VERIFY THE TOKEN
    const { id: schoolId } =
      await this.createdSchoolJwtService.verifyAsync(token);

    if (!schoolId) {
      throw new UnauthorizedException('Invalid link!');
    }

    return schoolId;
  }

  // * METHOD TO VALIDATE
  async verifyResetPasswordJWT(token: string): Promise<string> {
    this.logger.debug('Inside verifyResetPasswordJWT!');

    // * VERIFY FORGET_PASSWORD
    const { id: schoolId } =
      await this.forgetPasswordJwtService.verifyAsync(token);

    if (!schoolId) {
      throw new UnauthorizedException('Invalid Link!');
    }

    return schoolId;
  }
}
