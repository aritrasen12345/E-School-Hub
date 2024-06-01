// * Package imports
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
// import * as fs from 'fs';

// * Local imports
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // * Define logger
  const logger = new Logger('Main Module');
  0;
  // * Define configService
  const configService = app.get(ConfigService);

  // * Enable cors in the project
  app.enableCors({ origin: '*' });

  // * Use helmet middleware
  app.use(helmet());

  // * Use global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // * configure Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('E-School-Hub')
    .setDescription('API for E-School-Hub project built with NestJs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        description: 'Enter a JWT token to authorize the requests...',
      },
      'JWTBearerAuth',
    )
    .addGlobalParameters({
      name: 'Authorizations',
      in: 'header',
      required: false,
      example: 'Bearer <token>',
      schema: { type: 'string' },
    })
    .addSecurityRequirements('JWTBearerAuth')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    ignoreGlobalPrefix: true,
  });

  // * Define PORT
  const APP_PORT = configService.get<string>('APP_PORT') || 3000;

  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // * Generate Swagger html file
  // fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));

  await app.listen(APP_PORT);

  // * Verbose swagger logs
  logger.verbose('----------------------------------------------------');
  logger.verbose(`Application is running on: ${await app.getUrl()}`);
  logger.verbose('Swagger 🛠️ http://localhost:' + APP_PORT + '/swagger  🛠️');
  logger.verbose('----------------------------------------------------');
}
bootstrap();
