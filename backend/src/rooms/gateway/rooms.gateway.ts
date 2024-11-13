import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsEnterRequestDto } from '../dto/rooms.enter.request.dto';
import { RoomsService } from '../service/rooms.service';
import { RoomsEnterResponseDto } from '../dto/rooms.enter.response.dto';
import { ClientsService } from 'src/clients/service/clients.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import { HostGuard } from '../guard/rooms.host.guard';
import { ExistGuard } from '../guard/rooms.exist.guard';
import { ConnectionGuard } from '../guard/rooms.connection.guard';
import { JoinGuard } from '../guard/rooms.join.guard';
import { WsExceptionFilter } from '../filter/rooms.filter';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
@UseFilters(WsExceptionFilter)
export class RoomsGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly roomsService: RoomsService,
    private readonly clientsService: ClientsService,
  ) {}

  @UseGuards(ConnectionGuard)
  @SubscribeMessage('join')
  async join(
    @ConnectedSocket() client: Socket,
    @MessageBody() { roomId }: RoomsEnterRequestDto,
  ): Promise<RoomsEnterResponseDto> {
    if (!(await this.roomsService.isExistRoom(roomId))) {
      throw new WsException('존재하지 않는 방입니다.');
    }

    client.join(roomId);
    const hostId = await this.roomsService.join(roomId, client.id);

    client.data.roomId = roomId;
    client.data.nickname = this.clientsService.randomNickname();
    this.server.to(roomId).emit('participant:join', {
      participantId: client.id,
      nickname: client.data.nickname,
    });

    const participants = Array.from(this.server.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
      const socket = this.server.sockets.sockets.get(socketId);
      return {
        id: socketId,
        nickname: socket?.data?.nickname || '',
      };
    });

    const roomsJoinDto = { participants, hostId };

    return { status: 'ok', body: roomsJoinDto };
  }

  @UseGuards(JoinGuard, HostGuard)
  @SubscribeMessage('participant:host:start')
  startToEmpathise(@ConnectedSocket() client: Socket): void {
    const roomId = client.data.roomId;

    const empathyTopics = this.roomsService.getEmpathyTopics();

    this.server.to(roomId).emit('empathy:start', { questions: empathyTopics });
  }

  @UseGuards(JoinGuard)
  handleDisconnect(client: Socket): void {
    const roomId = client.data.roomId;

    const clients = Array.from(this.server.sockets.adapter.rooms.get(roomId) || []);

    if (clients.length === 0) {
      this.roomsService.deleteRoom(roomId);
      return;
    }

    const hostId = this.roomsService.getHostInfo(roomId);
    const hostChangeFlag = hostId === client.id;

    this.server.to(roomId).emit('participant:exit', {
      participantId: client.id,
      nickname: client.data.nickname,
    });

    if (!hostChangeFlag) {
      return;
    }

    const hostInfo = clients
      .filter((socketId) => socketId !== client.id)
      .map((socketId) => {
        const socket = this.server.sockets.sockets.get(socketId);
        return {
          participantId: socket.id,
          nickname: socket.data?.nickname || '',
        };
      })[0];

    this.server.to(roomId).emit('participant:host:change', hostInfo);
  }
}
