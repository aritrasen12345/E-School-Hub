import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    this.logger.debug('Inside validate!');
    const school = await this.authService.validateSchoolCredentials(
      email,
      password,
    );

    if (!school) {
      throw new UnauthorizedException('No school found!');
    }

    return school;
  }
}
