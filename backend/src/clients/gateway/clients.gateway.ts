import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseFilters, UseGuards } from '@nestjs/common';
import { ConnectGuard } from '../../common/guard/connect.guard';
import { JoinGuard } from '../../common/guard/join.guard';
import { HostGuard } from '../../common/guard/host.guard';
import { RoomsService } from '../../rooms/service/rooms.service';
import { KeywordsAlertDto } from '../../keywords/dto/keywords.alert.dto';
import { PHASE } from '../../common/definition/phase';
import { SocketCustomExceptionFilter } from '../../common/filter/socket.custom-exception.filter';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
@UseFilters(SocketCustomExceptionFilter)
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
    this.roomsService.setPhase(roomId, PHASE.KEYWORD);

    const empathyTopics = this.roomsService.getEmpathyTopics();

    this.server.to(roomId).emit('empathy:start', { questions: empathyTopics });

    const finishTime = empathyTopics[empathyTopics.length - 1].expirationTime;
    this.roomsService.generateBroadcastStatisticsEvent(roomId, finishTime, this.endToEmpathise.bind(this));
  }

  private endToEmpathise(roomId: string, statistics: Record<string, KeywordsAlertDto[]>) {
    this.server.to(roomId).emit('empathy:result', statistics);
  };
}
