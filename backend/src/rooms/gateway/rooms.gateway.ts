import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsEnterRequestDto } from '../dto/rooms.enter.request.dto';
import { RoomsService } from '../service/rooms.service';
import { OnModuleInit, UseFilters, UseGuards } from '@nestjs/common';
import { ConnectGuard } from '../../common/guard/connect.guard';
import { JoinGuard } from '../../common/guard/join.guard';
import { WsExceptionFilter } from '../../common/filter/ws-exception.filter';
import { ExistGuard } from '../../common/guard/exist.guard';
import { ClientsService } from '../../clients/service/clients.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
@UseFilters(WsExceptionFilter)
export class RoomsGateway implements OnModuleInit, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly roomsService: RoomsService,
    private readonly clientsService: ClientsService,
  ) {
  }

  onModuleInit() {
    const adapter = this.server.of('/').adapter;

    adapter.on('delete-room', (roomId) => {
      this.roomsService.deleteRoom(roomId);
    });
  }

  @UseGuards(ConnectGuard, ExistGuard)
  @SubscribeMessage('join')
  join(
    @ConnectedSocket() client: Socket,
    @MessageBody() { roomId }: RoomsEnterRequestDto,
  ) {
    client.join(roomId);
    const hostId = this.roomsService.setHostIfHostUndefined(roomId, client.id);

    client.data.roomId = roomId;
    client.data.nickname = this.clientsService.randomNickname();

    this.server.to(roomId).emit('participant:join', {
      participantId: client.id,
      nickname: client.data.nickname,
    });

    const socketIds = this.server.sockets.adapter.rooms.get(roomId);

    const participants = Array.from(socketIds).map((socketId) => {
      const socket = this.server.sockets.sockets.get(socketId);
      return {
        id: socketId,
        nickname: socket?.data?.nickname
      };
    });

    const roomsJoinDto = { participants, hostId };

    return { status: 'ok', body: roomsJoinDto };
  }

  @UseGuards(JoinGuard)
  handleDisconnect(client: Socket): void {
    const roomId = client.data.roomId;

    const clients = this.server.sockets.adapter.rooms.get(roomId);

    if (clients === undefined || clients.size === 0) {
      return;
    }

    const hostId = this.roomsService.getHostId(roomId);
    const hostChangeFlag = hostId === client.id;

    this.server.to(roomId).emit('participant:exit', {
      participantId: client.id,
      nickname: client.data.nickname,
    });

    if (!hostChangeFlag) {
      return;
    }

    const nextHostId = Array.from(clients)[0];
    const socket = this.server.sockets.sockets.get(nextHostId);

    this.roomsService.setHost(roomId, nextHostId);

    this.server.to(roomId).emit('participant:host:change', {
      participantId: socket.id,
      nickname: socket.data?.nickname,
    });
  }
}
