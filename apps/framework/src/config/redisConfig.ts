import { RedisModule } from '@nestjs-modules/ioredis';
import { getConfig } from 'apps/common/src/utils/Config';

const { REDIS_CONFIG } = getConfig();
export default RedisModule.forRoot({
  type: 'single',
  options: REDIS_CONFIG,
});
