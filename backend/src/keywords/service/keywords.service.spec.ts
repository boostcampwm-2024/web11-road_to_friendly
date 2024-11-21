import { Test, TestingModule } from '@nestjs/testing';
import { KeywordsService } from './keywords.service';
import { KeywordsInMemoryRepository } from '../repository/keywords.in-memory.repository';

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
