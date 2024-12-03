import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit, UseFilters, UseGuards, UsePipes } from '@nestjs/common';

import { InterestsYoutubeLinkDto } from '../dto/interests.youtube.link.dto';
import { PhaseInterestGuard } from '../../common/guard/phase.guard';
import { InterestsService } from '../service/interests.service';
import { INTERESTS_RESOURCE } from '../definition/interests.resource';
import { Interest } from '../domain/interest';
import { RoomsService } from '../../rooms/service/rooms.service';
import { SocketCustomExceptionFilter } from '../../common/filter/socket.custom-exception.filter';
import { ParticipantGuard } from '../../common/guard/participant.guard';
import { InterestsImageDto } from '../dto/interests.image.dto';
import { InterestsYoutubeControlDto } from '../dto/interests.youtube.control.dto';
import { InterestsYoutubeControlResponseDto } from '../dto/interests.youtube.control.response.dto';
import { INTERESTS_YOUTUBE_CONTROL, interestsYoutubeControl } from '../definition/interests.youtube.control';
import { ValidateImageExtensionGuard } from '../guard/validate.image.extention.guard';
import { CustomValidationPipe } from '../pipe/custom-validation.pipe';

@WebSocketGateway()
@UseFilters(SocketCustomExceptionFilter)
@UseGuards(ParticipantGuard, PhaseInterestGuard)
export class InterestsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly interestsService: InterestsService,
    private readonly roomsService: RoomsService,
  ) {}

  onModuleInit() {
    const adapter = this.server.of('/').adapter;

    adapter.on('delete-room', (roomId) => {
      this.interestsService.deleteRoomInterest(roomId);
    });
  }

  @UseGuards(ValidateImageExtensionGuard)
  @SubscribeMessage('interest:image')
  async suggestImage(@ConnectedSocket() client: Socket, @MessageBody() data: InterestsImageDto) {
    const roomId = client.data.roomId;
    const imgUrl = await this.interestsService.uploadImage(data);
    const interest = new Interest(client.id, INTERESTS_RESOURCE.IMAGE, imgUrl);
    return this.shareInterest(roomId, interest);
  }

  @UsePipes(CustomValidationPipe)
  @SubscribeMessage('interest:youtube')
  async suggestYoutube(@ConnectedSocket() client: Socket, @MessageBody() { link }: InterestsYoutubeLinkDto) {
    const roomId = client.data.roomId;
    const interest = new Interest(client.id, INTERESTS_RESOURCE.YOUTUBE, link);
    return this.shareInterest(roomId, interest);
  }

  private shareInterest(roomId: string, interest: Interest) {
    const interestsBroadcastResponseDto = this.interestsService.addInterest(roomId, interest);

    if (interestsBroadcastResponseDto.nowQueueSize === 0) {
      this.server.to(roomId).emit('share:interest:broadcast', interestsBroadcastResponseDto);
    } else {
      this.server.to(roomId).emit('share:interest:add', { nowQueueSize: interestsBroadcastResponseDto.nowQueueSize });
    }

    return { status: 'ok' };
  }

  @SubscribeMessage('interest:youtube:play')
  async youtubePlay(@ConnectedSocket() client: Socket, @MessageBody() data: InterestsYoutubeControlDto) {
    const roomId = client.data.roomId;

    const correctedTime = await this.interestsService.getCorrectedSeconds(data.clientTimestamp, data.videoCurrentTime);

    this.broadcastYoutubeControl(client, roomId, INTERESTS_YOUTUBE_CONTROL.PLAY, {
      videoCurrentTime: correctedTime,
      playStatus: data.playStatus,
    });
  }

  @SubscribeMessage('interest:youtube:stop')
  youtubeStop(@ConnectedSocket() client: Socket, @MessageBody() data: InterestsYoutubeControlDto) {
    const roomId = client.data.roomId;

    this.broadcastYoutubeControl(client, roomId, INTERESTS_YOUTUBE_CONTROL.STOP, {
      videoCurrentTime: data.videoCurrentTime,
      playStatus: data.playStatus,
    });
  }

  @SubscribeMessage('interest:youtube:timeline')
  async youtubeChangeTimeline(@ConnectedSocket() client: Socket, @MessageBody() data: InterestsYoutubeControlDto) {
    const roomId = client.data.roomId;

    const correctedTargetTime =
      data.playStatus === 'play'
        ? await this.interestsService.getCorrectedSeconds(data.clientTimestamp, data.targetTime)
        : data.targetTime;

    this.broadcastYoutubeControl(client, roomId, INTERESTS_YOUTUBE_CONTROL.TIMELINE, {
      targetTime: correctedTargetTime,
      playStatus: data.playStatus,
    });
  }

  @SubscribeMessage('interest:youtube:speed')
  youtubeChangespeed(@ConnectedSocket() client: Socket, @MessageBody() data: InterestsYoutubeControlDto) {
    const roomId = client.data.roomId;

    this.broadcastYoutubeControl(client, roomId, INTERESTS_YOUTUBE_CONTROL.SPEED, {
      playSpeed: data.playSpeed,
    });
  }

  @SubscribeMessage('interest:youtube:dragging')
  youtubeDragging(@ConnectedSocket() client: Socket) {
    const roomId = client.data.roomId;

    this.broadcastYoutubeControl(client, roomId, INTERESTS_YOUTUBE_CONTROL.DRAGGING);
  }

  private broadcastYoutubeControl(
    client: Socket,
    roomId: string,
    requestType: interestsYoutubeControl,
    options: { videoCurrentTime?: number; playStatus?: string; targetTime?: number; playSpeed?: number } = {},
  ) {
    const responseDto = InterestsYoutubeControlResponseDto.of(requestType, options);
    client.broadcast.to(roomId).emit('share:interest:youtube', responseDto);
  }

  @SubscribeMessage('interest:next')
  async next(@ConnectedSocket() client: Socket) {
    const roomId = client.data.roomId;
    const clientId = client.id;
    const hostFlag = await this.roomsService.isHost(roomId, clientId);

    const interestsBroadcastResponseDto = this.interestsService.next(roomId, hostFlag, clientId);

    this.server.to(roomId).emit('share:interest:broadcast', interestsBroadcastResponseDto);
  }
}
