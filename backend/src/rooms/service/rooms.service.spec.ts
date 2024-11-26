import { Test, TestingModule } from '@nestjs/testing';

import { RoomsInMemoryRepository } from '../repository/rooms.in-memory.repository';
import { KeywordsInMemoryRepository } from '../../keywords/repository/keywords.in-memory.repository';

import { RoomsService } from './rooms.service';

describe('RoomsService', () => {
  let service: RoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomsService, RoomsInMemoryRepository, KeywordsInMemoryRepository],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
