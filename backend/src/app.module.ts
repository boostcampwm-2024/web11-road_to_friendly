import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsGateway } from './rooms/gateway/rooms.gateway';
import { RoomsService } from './rooms/service/rooms.service';
import { RoomsController } from './rooms/controller/rooms.controller';
import { EmpathyGateway } from './empathy/gateway/empathy.gateway';
import { EmpathyService } from './empathy/service/empathy.service';
import { EmpathyInMemoryRepository } from './empathy/repository/empathy.in-memory.repository';
import { ClientsGateway } from './clients/gateway/clients.gateway';
import { ClientsService } from './clients/service/clients.service';
import { RoomsInMemoryRepository } from './rooms/repository/rooms.in-memory.repository';
import { HostGuard } from './rooms/guard/rooms.host.guard';
import { JoinGuard } from './rooms/guard/rooms.join.guard';
import { ExistGuard } from './rooms/guard/rooms.exist.guard';
import { ConnectionGuard } from './rooms/guard/rooms.connection.guard';

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
    ConnectionGuard,
    EmpathyGateway,
    EmpathyService,
    EmpathyInMemoryRepository,
    ClientsGateway,
    ClientsService,
  ],
})
export class AppModule {}
