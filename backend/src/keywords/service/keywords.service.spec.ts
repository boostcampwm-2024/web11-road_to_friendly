import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { KeywordsRepositoryProvider } from '../repository/keywords.repository.provider';
import { RedisProvider } from '../../common/provider/redis-provider';

import { KeywordsService } from './keywords.service';


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
