import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { InterestsInMemoryRepository } from './interests.in-memory.repository';
import { InterestsRepository } from './interests.repository';
import { InterestsRedisRepository } from './interests.redis.repository';

export const InterestsRepositoryProvider: Provider = {
  provide: 'INTERESTS_REPOSITORY',
  useFactory: (redis: Redis, configService: ConfigService): InterestsRepository => {
    const environment = configService.get<string>('NODE_ENV', 'sample');

    if (environment === 'sample') {
      return new InterestsInMemoryRepository();
    }

    return new InterestsRedisRepository(redis);
  },
  inject: ['REDIS_CLIENT', ConfigService],
};
