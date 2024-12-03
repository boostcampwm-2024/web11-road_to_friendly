import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { RoomsService } from '../service/rooms.service';
import { RoomsRepositoryProvider } from '../repository/rooms.repository.provider';
import { KeywordsRepositoryProvider } from '../../keywords/repository/keywords.repository.provider';
import { RedisProvider } from '../../common/provider/redis-provider';

import { RoomsController } from './rooms.controller';

describe('RoomsController', () => {
  let controller: RoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [RoomsService, RoomsRepositoryProvider, KeywordsRepositoryProvider, RedisProvider, ConfigService],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
