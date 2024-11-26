import { Test, TestingModule } from '@nestjs/testing';

import { InterestsService } from '../service/interests.service';
import { InterestsInMemoryRepository } from '../repository/interests.in-memory.repository';
import { RoomsService } from '../../rooms/service/rooms.service';
import { RoomsInMemoryRepository } from '../../rooms/repository/rooms.in-memory.repository';
import { KeywordsInMemoryRepository } from '../../keywords/repository/keywords.in-memory.repository';

import { InterestsGateway } from './interests.gateway';

describe('ShowcasesGateway', () => {
  let gateway: InterestsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterestsGateway,
        InterestsService,
        InterestsInMemoryRepository,
        RoomsService,
        RoomsInMemoryRepository,
        KeywordsInMemoryRepository],
    }).compile();

    gateway = module.get<InterestsGateway>(InterestsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
