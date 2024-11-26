import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RoomsGateway } from './rooms/gateway/rooms.gateway';
import { RoomsService } from './rooms/service/rooms.service';
import { RoomsController } from './rooms/controller/rooms.controller';
import { KeywordsGateway } from './keywords/gateway/keywords.gateway';
import { KeywordsService } from './keywords/service/keywords.service';
import { KeywordsInMemoryRepository } from './keywords/repository/keywords.in-memory.repository';
import { ClientsGateway } from './clients/gateway/clients.gateway';
import { ClientsService } from './clients/service/clients.service';
import { RoomsInMemoryRepository } from './rooms/repository/rooms.in-memory.repository';
import { HostGuard } from './common/guard/host.guard';
import { JoinGuard } from './common/guard/join.guard';
import { ExistGuard } from './common/guard/exist.guard';
import { ConnectGuard } from './common/guard/connect.guard';
import { InterestsGateway } from './interests/gateway/interests.gateway';
import { InterestsService } from './interests/service/interests.service';
import { InterestsInMemoryRepository } from './interests/repository/interests.in-memory.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
      validationOptions: {
        abortEarly: true,
      },
    })
  ],
  controllers: [RoomsController],
  providers: [
    RoomsGateway,
    RoomsService,
    RoomsInMemoryRepository,
    HostGuard,
    JoinGuard,
    ExistGuard,
    ConnectGuard,
    KeywordsGateway,
    KeywordsService,
    KeywordsInMemoryRepository,
    ClientsGateway,
    ClientsService,
    InterestsGateway,
    InterestsService,
    InterestsInMemoryRepository
  ],
})
export class AppModule {}
