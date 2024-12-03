import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit, UseFilters, UseGuards } from '@nestjs/common';

import { RoomsEnterRequestDto } from '../dto/rooms.enter.request.dto';
import { RoomsService } from '../service/rooms.service';
import { ConnectGuard } from '../../common/guard/connect.guard';
import { ParticipantGuard } from '../../common/guard/participant.guard';
import { SocketCustomExceptionFilter } from '../../common/filter/socket.custom-exception.filter';
import { ExistGuard } from '../../common/guard/exist.guard';
import { ClientsService } from '../../clients/service/clients.service';
import { PhaseReadyGuard } from '../../common/guard/phase.guard';

@WebSocketGateway()
@UseFilters(SocketCustomExceptionFilter)
export class RoomsGateway implements OnModuleInit, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly roomsService: RoomsService,
    private readonly clientsService: ClientsService,
  ) {}

  onModuleInit() {
    const adapter = this.server.of('/').adapter;

    adapter.on('delete-room', (roomId) => {
      this.roomsService.deleteRoom(roomId);
    });
  }

  @UseGuards(ConnectGuard, ExistGuard, PhaseReadyGuard)
  @SubscribeMessage('join')
  async join(@ConnectedSocket() client: Socket, @MessageBody() { roomId }: RoomsEnterRequestDto) {
    client.join(roomId);
    const hostId = await this.roomsService.setHostIfHostUndefined(roomId, client.id);

    client.data.roomId = roomId;
    client.data.nickname = this.clientsService.randomNickname();

    this.server.to(roomId).emit('participant:join', {
      participantId: client.id,
      nickname: client.data.nickname,
    });

    const sockets = await this.server.in(roomId).fetchSockets();

    const participants = sockets.map((socket) => {
      return {
        id: socket.id,
        nickname: socket?.data?.nickname,
      };
    });

    const roomsJoinDto = { participants, hostId };

    return { status: 'ok', body: roomsJoinDto };
  }

  @UseGuards(ParticipantGuard)
  async handleDisconnect(client: Socket) {
    const roomId = client.data.roomId;

    const clients = await this.server.in(roomId).fetchSockets();

    if (clients === undefined || clients.length === 0) {
      return;
    }

    const hostId = await this.roomsService.getHostId(roomId);
    const hostChangeFlag = hostId === client.id;

    this.server.to(roomId).emit('participant:exit', {
      participantId: client.id,
      nickname: client.data.nickname,
    });

    if (!hostChangeFlag) {
      return;
    }

    const hostSocket = clients[0];
    const nextHostId = hostSocket.id;

    this.roomsService.setHost(roomId, nextHostId);

    this.server.to(roomId).emit('participant:host:change', {
      participantId: nextHostId,
      nickname: hostSocket.data?.nickname,
    });
  }
}
