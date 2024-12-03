import { Test, TestingModule } from '@nestjs/testing';

import { InterestsService } from '../service/interests.service';
import { RoomsService } from '../../rooms/service/rooms.service';

import { InterestsGateway } from './interests.gateway';
import { RoomsRepositoryProvider } from '../../rooms/repository/rooms.repository.provider';
import { KeywordsRepositoryProvider } from '../../keywords/repository/keywords.repository.provider';
import { RedisProvider } from '../../common/provider/redis-provider';
import { ConfigService } from '@nestjs/config';
import { InterestsRepositoryProvider } from '../repository/interests.repository.provider';

describe('InterestsGateway', () => {
  let gateway: InterestsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterestsGateway,
        InterestsService,
        InterestsRepositoryProvider,
        RoomsService,
        RoomsRepositoryProvider,
        KeywordsRepositoryProvider,
        RedisProvider,
        ConfigService,
      ],
    }).compile();

    gateway = module.get<InterestsGateway>(InterestsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
