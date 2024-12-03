import { Test, TestingModule } from '@nestjs/testing';

import { InterestsService } from './interests.service';
import { InterestsRepositoryProvider } from '../repository/interests.repository.provider';
import { ConfigService } from '@nestjs/config';

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
