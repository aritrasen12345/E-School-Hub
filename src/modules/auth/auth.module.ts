// * PACKAGE IMPORTS
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

@Module({
  imports: [
    // * IMPORT SCHOOL MONGOOSE MODULE
    MongooseModule.forFeature([{ name: School.name, schema: SchoolSchema }]),
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),

    // * IMPORT ACCESS_TOKEN JWT_MODULE
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        name: 'ACCESS_JWT',
        secret: configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
        signOptions: {
          expiresIn: '10m',
        },
      }),
    }),

    // * IMPORT REFRESH_TOKEN JWT_MODULE
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        name: 'REFRESH_JWT',
        secret: configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
        signOptions: {
          expiresIn: '30d',
        },
      }),
    }),

    // * IMPORT FORGET_PASSWORD_TOKEN JWT_MODULE
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        name: 'FORGET_PASSWORD_JWT',
        secret: configService.get<string>('FORGET_PASSWORD_SECRET_KEY'),
        signOptions: {
          expiresIn: '3600s',
        },
      }),
    }),

    // * IMPORT CREATED_PASSWORD_TOKEN JWT MODULE
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        name: 'CREATED_SCHOOL_JWT',
        secret: configService.get<string>('CREATED_SCHOOL_SECRET_KEY'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthHelper,
    AuthUtil,
    {
      provide: 'ACCESS_JWT',
      useFactory: (accessJwtService: JwtService) => accessJwtService,
      inject: [JwtService],
    },
    {
      provide: 'REFRESH_JWT',
      useFactory: (refreshJwtService: JwtService) => refreshJwtService,
      inject: [JwtService],
    },
    {
      provide: 'CREATED_SCHOOL_JWT',
      useFactory: (createdSchoolJwtService: JwtService) =>
        createdSchoolJwtService,
      inject: [JwtService],
    },
    {
      provide: 'FORGET_PASSWORD_JWT',
      useFactory: (forgetPasswordJwtService: JwtService) =>
        forgetPasswordJwtService,
      inject: [JwtService],
    },
    JWTStrategy,
    LocalStrategy,
  ],
})
export class AuthModule {}
