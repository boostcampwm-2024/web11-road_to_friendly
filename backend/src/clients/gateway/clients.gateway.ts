import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { ConnectGuard } from '../../common/guard/connect.guard';
import { JoinGuard } from '../../common/guard/join.guard';
import { HostGuard } from '../../common/guard/host.guard';
import { RoomsService } from '../../rooms/service/rooms.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class ClientsGateway {

  constructor(private readonly roomsService: RoomsService) {
  }

  @WebSocketServer()
  server: Server;

  @UseGuards(ConnectGuard)
  @SubscribeMessage('client:update')
  updateClientInfo(@ConnectedSocket() client: Socket, @MessageBody() { nickname }): void {
    const roomId = client.data.roomId;
    client.data.nickname = nickname.trim();

    this.server.to(roomId).emit('participant:info:update', { participantId: client.id, nickname });
  }

  @UseGuards(JoinGuard, HostGuard)
  @SubscribeMessage('client:host:start')
  startToEmpathise(@ConnectedSocket() client: Socket): void {
    const roomId = client.data.roomId;

    const empathyTopics = this.roomsService.getEmpathyTopics();

    this.server.to(roomId).emit('empathy:start', { questions: empathyTopics });
  }
}
