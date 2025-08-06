import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envNumber } from 'apps/common/src/utils/Env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(envNumber('APP_PORT'));
}
bootstrap();
