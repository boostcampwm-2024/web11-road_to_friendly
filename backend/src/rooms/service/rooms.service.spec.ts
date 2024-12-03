import { Test, TestingModule } from '@nestjs/testing';

import { RoomsService } from './rooms.service';
import { RoomsRepositoryProvider } from '../repository/rooms.repository.provider';
import { KeywordsRepositoryProvider } from '../../keywords/repository/keywords.repository.provider';
import { RedisProvider } from '../../common/provider/redis-provider';
import { ConfigService } from '@nestjs/config';

describe('RoomsService', () => {
  let service: RoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomsService, RoomsRepositoryProvider, KeywordsRepositoryProvider, RedisProvider, ConfigService],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
