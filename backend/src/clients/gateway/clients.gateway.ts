import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { ConnectGuard } from '../../common/guard/connect.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class ClientsGateway {
  @WebSocketServer()
  server: Server;

  @UseGuards(ConnectGuard)
  @SubscribeMessage('client:update')
  updateClientInfo(@ConnectedSocket() client: Socket, @MessageBody() { nickname }): void {
    const roomId = client.data.roomId;
    client.data.nickname = nickname.trim();

    this.server.to(roomId).emit('participant:info:update', { participantId: client.id, nickname });
  }
}
