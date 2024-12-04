import Redis from 'ioredis';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { RedisProvider } from '../../common/provider/redis-provider';
import { InterestsRedisRepository } from './interests.redis.repository';
import { InterestsRepositoryProvider } from './interests.repository.provider';
import { Interest } from '../domain/interest';
import { INTERESTS_RESOURCE } from '../definition/interests.resource';
import { InterestsBroadcastResponseDto } from '../dto/interests.broadcast.response.dto';
import { CustomException } from '../../common/exception/custom-exception';

describe('InterestsRedisRepository', () => {
  let redisClient: Redis;
  let repository: InterestsRedisRepository;

  beforeAll(async () => {
    const configServiceMock = {
      get: jest.fn().mockImplementation((key: string, defaultValue?: string) => {
        if (key === 'NODE_ENV') return 'dev';
        if (key === 'REDIS_HOST') return 'localhost';
        if (key === 'REDIS_PORT') return '6379';
        return defaultValue;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisProvider,
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        InterestsRepositoryProvider,
      ],
    }).compile();

    await module.init();

    redisClient = module.get<Redis>('REDIS_CLIENT');
    repository = module.get<InterestsRedisRepository>('INTERESTS_REPOSITORY');
  });

  afterEach(async () => {
    await redisClient.flushdb();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('관심사 공유 혹은 큐에 대기', () => {
    it('관심사를 공유하면 현재 대기 큐 크기를 받을 수 있어야 한다', async () => {
      const roomId = 'test-room';
      const interest: Interest = {
        clientId: 'client-1',
        resourceType: INTERESTS_RESOURCE.YOUTUBE,
        resourceUrl: 'https://www.youtube.com/watch?v=RuzWBug-JLQ',
      };

      const result1 = await repository.addInterestIfBroadcasting(roomId, interest);
      expect(result1).toEqual(InterestsBroadcastResponseDto.of(interest, 0));

      const result2 = await repository.addInterestIfBroadcasting(roomId, interest);
      expect(result2).toEqual(InterestsBroadcastResponseDto.of(interest, 1));
    });
  });

  describe('next', () => {
    it('큐에 관심사가 존재하지 않는 경우 빈 값이 반환되어야 한다.', async () => {
      const roomId = 'next-1';
      const hostFlag = true;
      const clientId = 'client-1';

      const result = await repository.next(roomId, hostFlag, clientId);

      expect(result).toEqual({
        participantId: undefined,
        resourceType: undefined,
        resourceUrl: undefined,
        nowQueueSize: 0,
      });
    });

    it('큐에 관심사가 존재한 경우 다음 관심사를 받아야 한다', async () => {
      const roomId = 'next-2';
      const hostFlag = false;
      const clientId = 'client-1';

      const interest: Interest = {
        clientId,
        resourceType: INTERESTS_RESOURCE.YOUTUBE,
        resourceUrl: '첫번째',
      };

      const nextInterest: Interest = {
        clientId,
        resourceType: INTERESTS_RESOURCE.IMAGE,
        resourceUrl: '두번째',
      };

      await repository.addInterestIfBroadcasting(roomId, interest);
      await repository.addInterestIfBroadcasting(roomId, nextInterest);

      const result1 = await repository.next(roomId, hostFlag, clientId);
      expect(result1).toEqual(InterestsBroadcastResponseDto.of(nextInterest, 0));
    });

    it('호스트는 clientId와 상관없이 다음 관심사를 요청할 수 있어야 한다', async () => {
      const roomId = 'next-3';
      const hostFlag = true;
      const clientId = 'client-1';

      const interest: Interest = {
        clientId,
        resourceType: INTERESTS_RESOURCE.YOUTUBE,
        resourceUrl: '첫번째',
      };

      const nextInterest: Interest = {
        clientId,
        resourceType: INTERESTS_RESOURCE.IMAGE,
        resourceUrl: '두번째',
      };

      await repository.addInterestIfBroadcasting(roomId, interest);
      await repository.addInterestIfBroadcasting(roomId, nextInterest);

      const result1 = await repository.next(roomId, hostFlag, 'host');
      expect(result1).toEqual(InterestsBroadcastResponseDto.of(nextInterest, 0));

      const result2 = await repository.next(roomId, hostFlag, 'host');
      expect(result2).toEqual({
        participantId: undefined,
        resourceType: undefined,
        resourceUrl: undefined,
        nowQueueSize: 0,
      });
    });

    it('권한이 없는 경우 예외가 발생해야 한다', async () => {
      const roomId = 'next-4';
      const hostFlag = false;

      const interest: Interest = {
        clientId: 'client-1',
        resourceType: INTERESTS_RESOURCE.YOUTUBE,
        resourceUrl: 'https://www.youtube.com/watch?v=RuzWBug-JLQ',
      };

      await repository.addInterestIfBroadcasting(roomId, interest);

      await expect(repository.next(roomId, hostFlag, 'client-2')).rejects.toThrow(CustomException);
    });
  });
});
