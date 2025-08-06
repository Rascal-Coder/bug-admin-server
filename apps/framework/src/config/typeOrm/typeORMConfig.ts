import { join } from 'node:path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env, envBoolean, envNumber } from 'apps/common/src/utils/Env';
// import { getConfig } from 'apps/common/src/utils/Config';

const entitiesPaths = [
  join(__dirname, '..', '..', '..', '..', '**', '*.entity.{ts,js}'),
];

// const { MYSQL_CONFIG } = getConfig();

export default TypeOrmModule.forRoot({
  // ...MYSQL_CONFIG,
  type: 'mysql',
  host: env('DB_HOST'),
  port: envNumber('DB_PORT'),
  username: env('MYSQL_USERNAME'),
  password: env('MYSQL_PASSWORD'),
  database: env('MYSQL_DATABASE'),
  synchronize: envBoolean('DB_SYNCHRONIZE'),
  logging: envBoolean('DB_LOGGING'),
  connectorPackage: 'mysql2',
  entities: entitiesPaths,
});
