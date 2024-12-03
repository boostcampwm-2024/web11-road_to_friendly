import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoomsInMemoryRepository } from './rooms.in-memory.repository';
import { RoomsRedisRepository } from './rooms.redis.repository';
import Redis from 'ioredis';

export const RoomsRepositoryProvider: Provider = {
  provide: 'ROOMS_REPOSITORY',
  useFactory: (redis: Redis, configService: ConfigService) => {
    const environment = configService.get<string>('NODE_ENV', 'sample');

    if (environment === 'sample') {
      return new RoomsInMemoryRepository();
    }

    return new RoomsRedisRepository(redis);
  },
  inject: ['REDIS_CLIENT', ConfigService],
};
