import { Test, TestingModule } from '@nestjs/testing';
import { ClientsGateway } from './clients.gateway';
import { ClientsService } from '../service/clients.service';

describe('ClientsGateway', () => {
  let gateway: ClientsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientsGateway, ClientsService],
    }).compile();

    gateway = module.get<ClientsGateway>(ClientsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
