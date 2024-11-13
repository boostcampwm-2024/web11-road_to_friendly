import { Test, TestingModule } from '@nestjs/testing';
import { EmpathyGateway } from './empathy.gateway';
import { EmpathyService } from '../service/empathy.service';
import { EmpathyInMemoryRepository } from '../repository/empathy.in-memory.repository';

describe('EmpathyGateway', () => {
  let gateway: EmpathyGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmpathyGateway, EmpathyService, EmpathyInMemoryRepository],
    }).compile();

    gateway = module.get<EmpathyGateway>(EmpathyGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
