import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import appConfig from 'src/config/app.config';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JWTStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfig().appSecret,
    });
  }

  async validate(payload: any) {
    this.logger.debug('Inside validate');
    return {
      id: payload.id,
      user_role_code: payload.user_role_code,
    };
  }
}
