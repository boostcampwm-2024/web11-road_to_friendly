import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { RoomsService } from '../service/rooms.service';
import { ClientsService } from '../../clients/service/clients.service';
import { RoomsRepositoryProvider } from '../repository/rooms.repository.provider';
import { KeywordsRepositoryProvider } from '../../keywords/repository/keywords.repository.provider';
import { RedisProvider } from '../../common/provider/redis-provider';

import { RoomsGateway } from './rooms.gateway';

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
