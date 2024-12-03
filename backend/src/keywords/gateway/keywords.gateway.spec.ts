import { Test, TestingModule } from '@nestjs/testing';

import { KeywordsService } from '../service/keywords.service';
import { RoomsService } from '../../rooms/service/rooms.service';
import { KeywordsInMemoryRepository } from '../repository/keywords.in-memory.repository';
import { RoomsInMemoryRepository } from '../../rooms/repository/rooms.in-memory.repository';

import { KeywordsGateway } from './keywords.gateway';

describe('KeywordsGateway', () => {
  let gateway: KeywordsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeywordsGateway,
        KeywordsService,
        {
          provide: 'KEYWORDS_REPOSITORY',
          useFactory: () => new KeywordsInMemoryRepository(),
        },
        RoomsService,
        {
          provide: 'ROOMS_REPOSITORY',
          useFactory: () => new RoomsInMemoryRepository(),
        },
      ],
    }).compile();

    gateway = module.get<KeywordsGateway>(KeywordsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
