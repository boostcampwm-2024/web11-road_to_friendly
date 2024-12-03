import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { InterestsOSImageRepository } from './interests.os.image.repository';
import { InterestsInMemoryImageRepository } from './interests.in-memory.image.repository';

export const InterestsRepositoryProvider: Provider = {
  provide: 'INTERESTS_IMAGE_REPOSITORY',
  useFactory: (configService: ConfigService) => {
    const environment = configService.get<string>('NODE_ENV', 'sample').trim();

    if (environment === 'release') {
      return new InterestsOSImageRepository(configService);
    }
    return new InterestsInMemoryImageRepository();
  },
  inject: [ConfigService],
};
