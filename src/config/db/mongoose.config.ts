import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  MongooseModuleAsyncOptions,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

export default class MongooseConfig {
  static getOdmConfig(configService: ConfigService): MongooseModuleOptions {
    return {
      uri: configService.get<string>('MONGODB_CONNECTION_STRING'),
    };
  }
}

export const mongooseAsyncConfig: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<MongooseModuleOptions> =>
    MongooseConfig.getOdmConfig(configService),
};
