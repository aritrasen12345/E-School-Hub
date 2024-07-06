// * PACKAGE IMPORTS
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// * LOCAL IMPORTS
import {
  RefreshToken,
  RefreshTokenSchema,
  School,
  SchoolSchema,
} from 'src/common/schemas';
import { AuthHelper } from './helpers/auth.helper';
import { JWTStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthUtil } from './util/auth.util';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    // * IMPORT SCHOOL MONGOOSE MODULE
    MongooseModule.forFeature([
      { name: School.name, schema: SchoolSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),

    // * IMPORT MAIL_MODULE
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper, AuthUtil, JWTStrategy, LocalStrategy],
})
export class AuthModule {}
