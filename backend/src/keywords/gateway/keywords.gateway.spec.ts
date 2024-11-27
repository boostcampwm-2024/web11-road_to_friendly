import { Test, TestingModule } from '@nestjs/testing';

import { KeywordsService } from '../service/keywords.service';
import { KeywordsInMemoryRepository } from '../repository/keywords.in-memory.repository';
import { PhaseKeywordGuard } from '../../common/guard/phase.guard';
import { RoomsService } from '../../rooms/service/rooms.service';
import { RoomsInMemoryRepository } from '../../rooms/repository/rooms.in-memory.repository';

import { KeywordsGateway } from './keywords.gateway';

describe('KeywordsGateway', () => {
  let gateway: KeywordsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeywordsGateway,
        KeywordsService,
        KeywordsInMemoryRepository,
        PhaseKeywordGuard,
        RoomsService,
        RoomsInMemoryRepository,
      ],
    }).compile();

    gateway = module.get<KeywordsGateway>(KeywordsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
