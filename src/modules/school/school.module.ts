import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { School, SchoolSchema } from 'src/common/schemas';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    // * IMPORT MONGOOSE MODULE
    MongooseModule.forFeature([{ name: School.name, schema: SchoolSchema }]),

    // * IMPORT MAIL MODULE
    MailModule,
  ],
  controllers: [SchoolController],
  providers: [SchoolService],
  exports: [SchoolService],
})
export class SchoolModule {}
