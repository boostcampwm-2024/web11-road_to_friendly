import { Test, TestingModule } from '@nestjs/testing';
import { KeywordsGateway } from './keywords.gateway';
import { KeywordsService } from '../service/keywords.service';
import { KeywordsInMemoryRepository } from '../repository/keywords.in-memory.repository';

describe('KeywordsGateway', () => {
  let gateway: KeywordsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeywordsGateway, KeywordsService, KeywordsInMemoryRepository],
    }).compile();

    gateway = module.get<KeywordsGateway>(KeywordsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
