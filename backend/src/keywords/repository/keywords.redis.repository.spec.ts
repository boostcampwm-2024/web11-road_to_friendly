import { KeywordsRedisRepository } from './keywords.redis.repository';
import Redis from 'ioredis';
import { ACTION } from '../dto/keywords.info.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { KeywordsRepositoryProvider } from './keywords.repository.provider';
import { ConfigService } from '@nestjs/config';
import { RedisProvider } from '../../common/provider/redis-provider';

describe('KeywordsRedisRepository', () => {
  let redisClient: Redis;
  let repository: KeywordsRedisRepository;

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
        KeywordsRepositoryProvider,
      ],
    }).compile();

    await module.init();

    redisClient = module.get<Redis>('REDIS_CLIENT');
    repository = module.get<KeywordsRedisRepository>('KEYWORDS_REPOSITORY');
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

  describe('addKeyword', () => {
    it('키워드 추가 시 카운트 증가', async () => {
      const roomId = 'test-room';
      const questionId = 1;
      const keyword = 'test-keyword';
      const participantId = 'participant-1';

      // 키워드 추가
      const result = await repository.addKeyword(roomId, questionId, keyword, participantId);

      expect(result).toEqual({
        questionId,
        keyword,
        action: ACTION.PICK,
        count: 1,
      });
    });

    it('같은 참가자의 중복 키워드 추가 방지', async () => {
      const roomId = 'test-room';
      const questionId = 1;
      const keyword = 'test-keyword';
      const participantId = 'participant-1';

      // 첫 번째 추가
      await repository.addKeyword(roomId, questionId, keyword, participantId);

      // 동일 참가자, 동일 키워드 추가 시도
      const result = await repository.addKeyword(roomId, questionId, keyword, participantId);

      expect(result.count).toBe(1); // 카운트 변화 없음
    });
  });

  describe('removeKeyword', () => {
    it('키워드 제거 시 카운트 감소', async () => {
      const roomId = 'test-room';
      const questionId = 1;
      const keyword = 'test-keyword';
      const participantId = 'participant-1';

      // 키워드 추가
      await repository.addKeyword(roomId, questionId, keyword, participantId);

      // 키워드 제거
      const result = await repository.removeKeyword(roomId, questionId, keyword, participantId);

      expect(result).toEqual({
        questionId,
        keyword,
        action: ACTION.RELEASE,
        count: 0,
      });
    });
  });

  describe('getStatistics', () => {
    it('방의 키워드 통계 조회', async () => {
      const roomId = 'test-room';
      const questionId = 1;
      const keyword1 = 'keyword-1';
      const keyword2 = 'keyword-2';
      const participantId1 = 'participant-1';
      const participantId2 = 'participant-2';

      // 키워드 추가
      await repository.addKeyword(roomId, questionId, keyword1, participantId1);
      await repository.addKeyword(roomId, questionId, keyword1, participantId2);
      await repository.addKeyword(roomId, questionId, keyword2, participantId1);

      // 통계 조회
      const statistics = await repository.getStatistics(roomId);

      expect(Object.keys(statistics)).toContain(participantId1);
      expect(Object.keys(statistics)).toContain(participantId2);

      // 각 참가자의 키워드 통계 검증
      const participant1Stats = statistics[participantId1];
      const participant2Stats = statistics[participantId2];

      expect(participant1Stats).toHaveLength(2);
      expect(participant2Stats).toHaveLength(1);

      expect(
        participant1Stats.some((stat) => stat.questionId === questionId && stat.keyword === keyword1),
      ).toBeTruthy();
      expect(
        participant1Stats.some((stat) => stat.questionId === questionId && stat.keyword === keyword2),
      ).toBeTruthy();
      expect(
        participant2Stats.some((stat) => stat.questionId === questionId && stat.keyword === keyword1),
      ).toBeTruthy();
    });
  });

  describe('deleteRoomKeywordsInfo', () => {
    it('방의 모든 키워드 정보 삭제', async () => {
      const roomId = 'test-room';
      const questionId = 1;
      const keyword = 'test-keyword';
      const participantId = 'participant-1';

      // 키워드 추가
      await repository.addKeyword(roomId, questionId, keyword, participantId);

      // 방 키워드 정보 삭제
      repository.deleteRoomKeywordsInfo(roomId);

      // 통계 조회 시 빈 객체 반환 확인
      const statistics = await repository.getStatistics(roomId);
      expect(Object.keys(statistics)).toHaveLength(0);
    });
  });
});
