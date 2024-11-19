import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

@Module({
  imports: [],
  controllers: [AppController, RoomsController],
  providers: [
    AppService,
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
  ],
})
export class AppModule {
}
