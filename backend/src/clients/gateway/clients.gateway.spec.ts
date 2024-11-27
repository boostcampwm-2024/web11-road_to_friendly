import { Test, TestingModule } from '@nestjs/testing';

import { RoomsService } from '../../rooms/service/rooms.service';
import { RoomsInMemoryRepository } from '../../rooms/repository/rooms.in-memory.repository';
import { KeywordsInMemoryRepository } from '../../keywords/repository/keywords.in-memory.repository';

import { ClientsGateway } from './clients.gateway';

describe('ClientsGateway', () => {
  let gateway: ClientsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientsGateway, RoomsService, RoomsInMemoryRepository, KeywordsInMemoryRepository],
    }).compile();

    gateway = module.get<ClientsGateway>(ClientsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
