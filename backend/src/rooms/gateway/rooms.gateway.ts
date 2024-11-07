import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsEnterRequestDto } from '../dto/rooms.enter.request.dto';
import { RoomsService } from '../service/rooms.service';
import { RoomsEnterResponseDto } from '../dto/rooms.enter.response.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class RoomsGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomsService: RoomsService) {
  }

  @SubscribeMessage('join')
  join(@ConnectedSocket() client: Socket, @MessageBody() { roomId }: RoomsEnterRequestDto): RoomsEnterResponseDto {
    if (!this.roomsService.isExistRoom(roomId)) {
      return { status: 'error', message: '존재하지 않는 방입니다.' };
    }

    if (client.rooms.size !== 1) {
      return { status: 'error', message: '이미 접속한 방이 존재합니다.' };
    }

    const roomsJoinDto = this.roomsService.join(client, roomId);

    this.server.to(roomId).emit('participant:join', {
      participantId: client.id,
      nickname: client.data.nickname
    });

    return { status: 'ok', body: roomsJoinDto };
  }

  @SubscribeMessage('client:update')
  updateClientInfo(@ConnectedSocket() client: Socket, @MessageBody() { nickname }): void {
    const roomId = client.data.roomId;

    if (roomId === undefined) {
      throw new WsException('방에 참가하지 않으셨습니다.');
    }

    client.data.nickname = nickname;

    this.server.to(roomId).emit('participant:info:update', { participantId: client.id, nickname });
  }

  handleDisconnect(client: Socket): void {
    const roomId = client.data.roomId;

    if (!roomId) {
      return;
    }

    const { hostChangeFlag } = this.roomsService.exit(client, roomId);
    this.server.to(roomId).emit('participant:exit', {
      participantId: client.id,
      nickname: client.data.nickname
    });

    if (!hostChangeFlag) {
      return;
    }

    const hostInfo = this.roomsService.getHostInfo(roomId);
    this.server.to(roomId).emit('participant:host:change', hostInfo);
  }
}
