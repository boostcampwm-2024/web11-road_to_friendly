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

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class RoomsGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly roomsService: RoomsService,
    private readonly clientsService: ClientsService,
  ) {}

  @SubscribeMessage('join')
  async join(
    @ConnectedSocket() client: Socket,
    @MessageBody() { roomId }: RoomsEnterRequestDto,
  ): Promise<RoomsEnterResponseDto> {
    if (!this.roomsService.isExistRoom(roomId)) {
      return { status: 'error', message: '존재하지 않는 방입니다.' };
    }

    if (client.rooms.size !== 1) {
      return { status: 'error', message: '이미 접속한 방이 존재합니다.' };
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

  @SubscribeMessage('participant:host:start')
  startToEmpathise(@ConnectedSocket() client: Socket): void {
    const roomId = client.data.roomId;
    if (roomId === undefined) {
      throw new WsException('방에 참가하지 않으셨습니다.');
    }
    if (!this.roomsService.isHost(roomId, client.id)) {
      throw new WsException('호스트가 아닙니다.');
    }
    const empathyTopics = this.roomsService.getEmpathyTopics();

    this.server.to(roomId).emit('empathy:start', { questions: empathyTopics });
  }

  handleDisconnect(client: Socket): void {
    const roomId = client.data.roomId;
    if (!roomId) {
      return;
    }

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
