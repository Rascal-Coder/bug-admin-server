//---------------导入环境变量----------------\\
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
dotenv.config({ path: `.env.${process.env.RUNNING_ENV || 'development'}` });
//--------------------------------\\

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envNumber } from 'apps/common/src/utils/Env';
import { isDev } from 'apps/common/src/utils/Env';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomLogger } from 'apps/framework/src/config/CustomLogger';
import { INestApplication, Logger } from '@nestjs/common';
const swaggerPath = `http://localhost:8001/api-docs`;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  const port = envNumber('APP_PORT');
  app.setGlobalPrefix('api');
  setupSwagger(app);
  await app.listen(port);
  console.log(chalk.green.bold('🚀 服务已启动成功！'));
  console.log(
    chalk.blue(`📍 服务地址: ${chalk.underline(`http://localhost:${port}`)}`),
  );
  console.log(
    chalk.yellow(
      `🌍 环境: ${chalk.bold(process.env.RUNNING_ENV || 'development')}`,
    ),
  );
  const logger = new Logger('SwaggerModule');
  logger.log(`Swagger UI: ${swaggerPath}`);
  logger.log(`Swagger JSON: ${swaggerPath}/json`);
}
if (isDev) {
  execSync('npx tsx scripts/copyI18nAssets.ts', { stdio: 'inherit' });
}

function setupSwagger(app: INestApplication) {
  const documentBuilder = new DocumentBuilder()
    .setTitle('bug-admin-server')
    .setDescription(
      `
  🔷 **Base URL**: \`http://localhost:8001/api\` <br>
  🧾 **Swagger JSON**: [查看文档 JSON](${swaggerPath}/json)

  📌 [bug-admin-server](https://github.com/Rascal-Coder/bug-admin-server) 后台管理系统 API 文档.
      `,
    )
    .setVersion('1.0')
    .addServer(`http://localhost:8001/api`, 'Base URL');

  const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
    ignoreGlobalPrefix: true,
  });

  SwaggerModule.setup('api-docs', app, document, {
    jsonDocumentUrl: `/api-docs/json`,
  });
}
bootstrap();
