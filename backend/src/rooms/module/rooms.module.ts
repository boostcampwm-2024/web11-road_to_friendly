import { Module } from '@nestjs/common';
import { RoomsController } from '../controller/rooms.controller';
import { RoomsGateway } from '../gateway/rooms.gateway';
import { RoomsService } from '../service/rooms.service';
import { RoomsInMemoryRepository } from '../repository/rooms.in-memory.repository';
import { HostGuard } from '../guard/rooms.host.guard';
import { JoinGuard } from '../guard/rooms.join.guard';
import { ExistGuard } from '../guard/rooms.exist.guard';
import { ConnectionGuard } from '../guard/rooms.connection.guard';
import { ClientsModule } from 'src/clients/module/clients.module';

@Module({
  imports: [ClientsModule],
  controllers: [RoomsController],
  providers: [RoomsGateway, RoomsService, RoomsInMemoryRepository, HostGuard, JoinGuard, ExistGuard, ConnectionGuard],
})
export class RoomsModule {}
