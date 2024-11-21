import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from './rooms.controller';
import { RoomsService } from '../service/rooms.service';
import { RoomsInMemoryRepository } from '../repository/rooms.in-memory.repository';
import { KeywordsInMemoryRepository } from '../../keywords/repository/keywords.in-memory.repository';

describe('RoomsController', () => {
  let controller: RoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [RoomsService, RoomsInMemoryRepository, KeywordsInMemoryRepository]
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
