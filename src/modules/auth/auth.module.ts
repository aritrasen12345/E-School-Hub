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
        secret: configService.get<string>('ACCESS_TOKEN_SECRET_KEy'),
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
        secret: configService.get<string>('REFRESH_TOKEN_SECRET_KEy'),
        signOptions: {
          expiresIn: '30d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthHelper,
    {
      provide: 'ACCESS_TOKEN',
      useFactory: (jwtService: JwtService) => jwtService,
      inject: [JwtService],
    },
    {
      provide: 'REFRESH_JWT',
      useFactory: (refreshJwtService: JwtService) => refreshJwtService,
      inject: [JwtService],
    },
    JWTStrategy,
    LocalStrategy,
  ],
})
export class AuthModule {}
