import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InterestsYoutubeLinkDto } from '../dto/interests.youtube.link.dto';
import { UseFilters, UseGuards } from '@nestjs/common';
import { PhaseInterestGuard } from '../../common/guard/phase.keyword.guard';
import { InterestsService } from '../service/interests.service';
import { INTERESTS_RESOURCE } from '../definition/interests.resource';
import { Interest } from '../domain/interest';
import { RoomsService } from '../../rooms/service/rooms.service';
import { SocketCustomExceptionFilter } from '../../common/filter/socket.custom-exception.filter';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
@UseFilters(SocketCustomExceptionFilter)
@UseGuards(PhaseInterestGuard)
export class InterestsGateway {

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly interestsService: InterestsService,
    private readonly roomsService: RoomsService
  ) {
  }

  @SubscribeMessage('interest:youtube')
  async suggestYoutube(@ConnectedSocket() client: Socket, @MessageBody() { link }: InterestsYoutubeLinkDto) {
    const roomId = client.data.roomId;
    const interest = new Interest(client.id, INTERESTS_RESOURCE.YOUTUBE, link);
    const broadcastFlag = await this.interestsService.addInterest(roomId, interest);

    if (broadcastFlag) {
      this.server.to(roomId).emit('share:interest', interest);
    }
  }

  @SubscribeMessage('interest:next')
  async next(@ConnectedSocket() client: Socket) {
    const roomId = client.data.roomId;
    const clientId = client.id;
    const hostFlag = this.roomsService.isHost(roomId, clientId);

    const nextInterest = await this.interestsService.next(roomId, hostFlag, clientId);

    this.server.to(roomId).emit('share:interest', nextInterest);
  }
}
