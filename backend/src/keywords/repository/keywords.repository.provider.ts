import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { KeywordsInMemoryRepository } from './keywords.in-memory.repository';
import { KeywordsRedisRepository } from './keywords.redis.repository';

export const KeywordsRepositoryProvider: Provider = {
  provide: 'KEYWORDS_REPOSITORY',
  useFactory: (redis: Redis, configService: ConfigService) => {
    const environment = configService.get<string>('NODE_ENV', 'sample');

    if (environment === 'sample') {
      return new KeywordsInMemoryRepository();
    }

    return new KeywordsRedisRepository(redis);
  },
  inject: ['REDIS_CLIENT', ConfigService],
};
