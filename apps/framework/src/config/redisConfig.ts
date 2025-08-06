import { RedisModule } from '@nestjs-modules/ioredis';
import { env, envNumber } from 'apps/common/src/utils/Env';

export default RedisModule.forRoot({
  type: 'single',
  options: {
    port: envNumber('REDIS_PORT'),
    host: env('REDIS_HOST'),
    password: env('REDIS_PASSWORD'),
    db: envNumber('REDIS_DB'),
  },
});
