import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
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

  @SubscribeMessage('client:update')
  updateClientInfo(@ConnectedSocket() client: Socket, @MessageBody() { nickname }): void {
    const roomId = client.data.roomId;

    if (roomId === undefined) {
      throw new WsException('방에 참가하지 않으셨습니다.');
    }

    client.data.nickname = nickname;

    this.server.to(roomId).emit('participant:info:update', { participantId: client.id, nickname });
  }
}
