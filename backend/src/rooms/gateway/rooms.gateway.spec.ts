import { Test, TestingModule } from '@nestjs/testing';

import { RoomsService } from '../service/rooms.service';
import { ClientsService } from '../../clients/service/clients.service';

import { RoomsGateway } from './rooms.gateway';
import { RoomsRepositoryProvider } from '../repository/rooms.repository.provider';
import { KeywordsRepositoryProvider } from '../../keywords/repository/keywords.repository.provider';
import { ConfigService } from '@nestjs/config';
import { RedisProvider } from '../../common/provider/redis-provider';

describe('RoomsGateway', () => {
  let gateway: RoomsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsGateway,
        RoomsService,
        RoomsRepositoryProvider,
        ClientsService,
        KeywordsRepositoryProvider,
        ConfigService,
        RedisProvider,
      ],
    }).compile();

    gateway = module.get<RoomsGateway>(RoomsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
