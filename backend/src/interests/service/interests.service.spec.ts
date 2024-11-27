import { Test, TestingModule } from '@nestjs/testing';

import { InterestsInMemoryRepository } from '../repository/interests.in-memory.repository';

import { InterestsService } from './interests.service';

describe('InterestsService', () => {
  let service: InterestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InterestsService, InterestsInMemoryRepository],
    }).compile();

    service = module.get<InterestsService>(InterestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
