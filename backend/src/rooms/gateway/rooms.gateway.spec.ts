import { Test, TestingModule } from '@nestjs/testing';
import { RoomsGateway } from './rooms.gateway';
import { RoomsService } from '../service/rooms.service';
import { RoomsInMemoryRepository } from '../repository/rooms.in-memory.repository';
import { ClientsService } from 'src/clients/service/clients.service';

describe('RoomsGateway', () => {
  let gateway: RoomsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomsGateway, RoomsService, RoomsInMemoryRepository, ClientsService],
    }).compile();

    gateway = module.get<RoomsGateway>(RoomsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
