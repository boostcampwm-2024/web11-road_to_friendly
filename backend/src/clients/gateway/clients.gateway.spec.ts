import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { RoomsService } from '../../rooms/service/rooms.service';
import { RoomsRepositoryProvider } from '../../rooms/repository/rooms.repository.provider';
import { KeywordsRepositoryProvider } from '../../keywords/repository/keywords.repository.provider';
import { RedisProvider } from '../../common/provider/redis-provider';

import { ClientsGateway } from './clients.gateway';

describe('ClientsGateway', () => {
  let gateway: ClientsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsGateway,
        RoomsService,
        RoomsRepositoryProvider,
        KeywordsRepositoryProvider,
        ConfigService,
        RedisProvider,
      ],
    }).compile();

    gateway = module.get<ClientsGateway>(ClientsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
