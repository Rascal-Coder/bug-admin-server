import { join } from 'node:path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env, envBoolean, envNumber } from 'apps/common/src/utils/Env';

const entitiesPaths = [
  join(__dirname, '..', '..', '..', '..', '**', '*.entity.{ts,js}'),
];

export default TypeOrmModule.forRoot({
  // ...MYSQL_CONFIG,
  type: 'mysql',
  host: env('DB_HOST'),
  port: envNumber('DB_PORT'),
  username: env('DB_USERNAME'),
  password: env('DB_PASSWORD'),
  database: env('DB_DATABASE'),
  synchronize: envBoolean('DB_SYNCHRONIZE'),
  logging: envBoolean('DB_LOGGING'),
  connectorPackage: 'mysql2',
  entities: entitiesPaths,
});
