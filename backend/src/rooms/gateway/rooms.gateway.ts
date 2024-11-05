import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsEnterDto } from '../dto/rooms.enter.dto';
import { RoomsService } from '../service/rooms.service';
import { RoomsJoinDto } from '../dto/rooms.join.dto';

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
  join(@ConnectedSocket() client: Socket, @MessageBody() { roomId }: RoomsEnterDto): WsResponse<RoomsJoinDto> {
    if (!this.roomsService.isExistRoom(roomId)) {
      throw new WsException('존재하지 않는 방입니다.');
    }

    if (client.rooms.size !== 1) {
      throw new WsException('이미 접속한 방이 존재합니다.');
    }

    const roomsJoinDto = this.roomsService.join(client, roomId);

    this.server.to(roomId).emit('participant:join', {
      participantId: client.data.id,
      nickname: client.data.nickname
    });

    return { event: 'participant:info:list', data: roomsJoinDto };
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
      participantId: client.data.id,
      nickname: client.data.nickname
    });

    if (!hostChangeFlag) {
      return;
    }

    const hostInfo = this.roomsService.getHostInfo(roomId);
    this.server.to(roomId).emit('participant:host:change', hostInfo);
  }
}
