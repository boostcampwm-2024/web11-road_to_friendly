import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { InterestsImageRepository } from './interests.image.repository';
import { InterestsInMemoryRepository } from './interests.in-memory.repository';

export const InterestsRepositoryProvider: Provider = {
  provide: 'INTERESTS_REPOSITORY',
  useFactory: (configService: ConfigService) => {
    const environment = configService.get<string>('NODE_ENV', 'sample');

    if (environment === 'release') {
      return new InterestsImageRepository(configService);
    }
    return new InterestsInMemoryRepository();
  },
  inject: [ConfigService],
};
