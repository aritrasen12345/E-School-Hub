import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // * enable cors in the project
  app.enableCors({ origin: '*' });

  await app.listen(3000);
}
bootstrap();
