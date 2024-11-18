import { Test, TestingModule } from '@nestjs/testing';
import { ClientsGateway } from './clients.gateway';
import { RoomsService } from '../../rooms/service/rooms.service';
import { RoomsInMemoryRepository } from '../../rooms/repository/rooms.in-memory.repository';

describe('ClientsGateway', () => {
  let gateway: ClientsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientsGateway, RoomsService, RoomsInMemoryRepository],
    }).compile();

    gateway = module.get<ClientsGateway>(ClientsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
