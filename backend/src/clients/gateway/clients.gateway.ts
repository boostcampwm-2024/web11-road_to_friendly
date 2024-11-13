import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ClientsService } from '../service/clients.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class ClientsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly clientsService: ClientsService) {}
}
