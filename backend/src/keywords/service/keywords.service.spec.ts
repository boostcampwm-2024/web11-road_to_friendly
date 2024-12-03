import { Test, TestingModule } from '@nestjs/testing';

import { KeywordsService } from './keywords.service';
import { KeywordsRepositoryProvider } from '../repository/keywords.repository.provider';
import { RedisProvider } from '../../common/provider/redis-provider';
import { ConfigService } from '@nestjs/config';

describe('KeywordsService', () => {
  let service: KeywordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeywordsService, KeywordsRepositoryProvider, RedisProvider, ConfigService],
    }).compile();

    service = module.get<KeywordsService>(KeywordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
