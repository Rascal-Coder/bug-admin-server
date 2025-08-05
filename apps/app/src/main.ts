import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConfig } from 'apps/common/src/utils/Config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { SERVER_CONFIG } = getConfig();
  await app.listen(SERVER_CONFIG.port ?? 3000);
}
bootstrap();
