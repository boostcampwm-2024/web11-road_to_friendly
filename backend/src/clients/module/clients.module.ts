import { Module } from '@nestjs/common';
import { ClientsGateway } from '../gateway/clients.gateway';
import { ClientsService } from '../service/clients.service';

@Module({
  providers: [ClientsGateway, ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
