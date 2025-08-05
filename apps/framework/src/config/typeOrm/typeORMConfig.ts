import { join } from 'node:path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from 'apps/common/src/utils/Config';

const entitiesPaths = [
  join(__dirname, '..', '..', '..', '..', '**', '*.entity.{ts,js}'),
];

const { MYSQL_CONFIG } = getConfig();

export default TypeOrmModule.forRoot({
  ...MYSQL_CONFIG,
  entities: entitiesPaths,
});
