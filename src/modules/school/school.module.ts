import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { School, SchoolSchema } from 'src/common/schemas';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    // * IMPORT MONGOOSE MODULE
    MongooseModule.forFeature([{ name: School.name, schema: SchoolSchema }]),

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

    // * IMPORT MAIL MODULE
    MailModule,
  ],
  controllers: [SchoolController],
  providers: [
    SchoolService,
    {
      provide: 'CREATED_SCHOOL_JWT',
      useFactory: (createdSchoolJwtService: JwtService) =>
        createdSchoolJwtService,
      inject: [JwtService],
    },
  ],
})
export class SchoolModule {}
