import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { RoomsGateway } from './rooms/gateway/rooms.gateway';
import { RoomsService } from './rooms/service/rooms.service';
import { RoomsController } from './rooms/controller/rooms.controller';
import { KeywordsGateway } from './keywords/gateway/keywords.gateway';
import { KeywordsService } from './keywords/service/keywords.service';
import { ClientsGateway } from './clients/gateway/clients.gateway';
import { ClientsService } from './clients/service/clients.service';
import { HostGuard } from './common/guard/host.guard';
import { ParticipantGuard } from './common/guard/participant.guard';
import { ExistGuard } from './common/guard/exist.guard';
import { ConnectGuard } from './common/guard/connect.guard';
import { InterestsGateway } from './interests/gateway/interests.gateway';
import { InterestsService } from './interests/service/interests.service';
import { InterestsImageRepositoryProvider } from './interests/repository/interests.image.repository.provider';
import { RedisProvider } from './common/provider/redis-provider';
import { RoomsRepositoryProvider } from './rooms/repository/rooms.repository.provider';
import { KeywordsRepositoryProvider } from './keywords/repository/keywords.repository.provider';
import { CustomValidationPipe } from './interests/pipe/custom-validation.pipe';
import { IsYoutubeLinkConstraint } from './interests/decorator/is-youtube-link.decorator';
import { InterestsRepositoryProvider } from './interests/repository/interests.repository.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV?.trim() || 'sample'}`,
      validationOptions: {
        abortEarly: true,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'src', 'interests', 'shareImage'),
      serveRoot: '/shareImage',
    }),
  ],
  controllers: [RoomsController],
  providers: [
    RoomsGateway,
    RoomsService,
    HostGuard,
    ParticipantGuard,
    ExistGuard,
    ConnectGuard,
    KeywordsGateway,
    KeywordsService,
    ClientsGateway,
    ClientsService,
    InterestsGateway,
    InterestsService,
    InterestsImageRepositoryProvider,
    CustomValidationPipe,
    IsYoutubeLinkConstraint,
    RedisProvider,
    RoomsRepositoryProvider,
    KeywordsRepositoryProvider,
    InterestsRepositoryProvider,
  ],
  exports: ['INTERESTS_IMAGE_REPOSITORY'],
})
export class AppModule {}
