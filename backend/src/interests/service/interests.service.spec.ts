import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { InterestsRepositoryProvider } from '../repository/interests.repository.provider';

import { InterestsService } from './interests.service';

describe('InterestsService', () => {
  let service: InterestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InterestsService, InterestsRepositoryProvider, ConfigService],
    }).compile();

    service = module.get<InterestsService>(InterestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
