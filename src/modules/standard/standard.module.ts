import { Module } from '@nestjs/common';
import { StandardController } from './standard.controller';
import { StandardService } from './standard.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Standard, StandardSchema } from 'src/common/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Standard.name, schema: StandardSchema },
    ]),
  ],
  controllers: [StandardController],
  providers: [StandardService],
})
export class StandardModule {}
