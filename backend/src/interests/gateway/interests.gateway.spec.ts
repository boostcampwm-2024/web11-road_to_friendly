import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { InterestsService } from '../service/interests.service';
import { RoomsService } from '../../rooms/service/rooms.service';
import { RoomsRepositoryProvider } from '../../rooms/repository/rooms.repository.provider';
import { KeywordsRepositoryProvider } from '../../keywords/repository/keywords.repository.provider';
import { RedisProvider } from '../../common/provider/redis-provider';
import { InterestsImageRepositoryProvider } from '../repository/interests.image.repository.provider';

import { InterestsGateway } from './interests.gateway';

describe('InterestsGateway', () => {
  let gateway: InterestsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterestsGateway,
        InterestsService,
        InterestsImageRepositoryProvider,
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
