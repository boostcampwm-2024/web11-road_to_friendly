import { Test, TestingModule } from '@nestjs/testing';

import { KeywordsInMemoryRepository } from '../repository/keywords.in-memory.repository';

import { KeywordsService } from './keywords.service';

describe('KeywordsService', () => {
  let service: KeywordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeywordsService, KeywordsInMemoryRepository],
    }).compile();

    service = module.get<KeywordsService>(KeywordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
