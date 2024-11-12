import { Test, TestingModule } from '@nestjs/testing';
import { EmpathyService } from './empathy.service';
import { EmpathyInMemoryRepository } from '../repository/empathy.in-memory.repository';

describe('EmpathyService', () => {
  let service: EmpathyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmpathyService, EmpathyInMemoryRepository],
    }).compile();

    service = module.get<EmpathyService>(EmpathyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
