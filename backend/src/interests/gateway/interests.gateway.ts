import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit, UseFilters, UseGuards } from '@nestjs/common';

import { InterestsYoutubeLinkDto } from '../dto/interests.youtube.link.dto';
import { PhaseInterestGuard } from '../../common/guard/phase.guard';
import { InterestsService } from '../service/interests.service';
import { INTERESTS_RESOURCE } from '../definition/interests.resource';
import { Interest } from '../domain/interest';
import { RoomsService } from '../../rooms/service/rooms.service';
import { SocketCustomExceptionFilter } from '../../common/filter/socket.custom-exception.filter';
import { JoinGuard } from '../../common/guard/join.guard';
import { InterestsImageDto } from '../dto/interests.image.dto';
import { InterestsYoutubeControlDto } from '../dto/interests.youtube.control.dto';
import { InterestsYoutubeControlResponseDto } from '../dto/interests.youtube.control.response.dto';
import { INTERESTS_YOUTUBE_CONTROL } from '../definition/interests.youtube.control';

@WebSocketGateway()
@UseFilters(SocketCustomExceptionFilter)
@UseGuards(JoinGuard, PhaseInterestGuard)
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

  @SubscribeMessage('interest:image')
  async suggestImage(@ConnectedSocket() client: Socket, @MessageBody() data: InterestsImageDto) {
    const roomId = client.data.roomId;
    const imgUrl = await this.interestsService.uploadImage(data);
    const interest = new Interest(client.id, INTERESTS_RESOURCE.IMAGE, imgUrl);
    const interestsBroadcastResponseDto = await this.interestsService.addInterest(roomId, interest);

    if (interestsBroadcastResponseDto.nowQueueSize === 0) {
      this.server.to(roomId).emit('share:interest:broadcast', interestsBroadcastResponseDto);
    } else {
      this.server.to(roomId).emit('share:interest:add', interestsBroadcastResponseDto.nowQueueSize);
    }

    return { status: 'ok' };
  }

  @SubscribeMessage('interest:youtube')
  async suggestYoutube(@ConnectedSocket() client: Socket, @MessageBody() { link }: InterestsYoutubeLinkDto) {
    const roomId = client.data.roomId;
    const interest = new Interest(client.id, INTERESTS_RESOURCE.YOUTUBE, link);
    const interestsBroadcastResponseDto = await this.interestsService.addInterest(roomId, interest);

    if (interestsBroadcastResponseDto.nowQueueSize === 0) {
      this.server.to(roomId).emit('share:interest:broadcast', interestsBroadcastResponseDto);
    } else {
      this.server.to(roomId).emit('share:interest:add', interestsBroadcastResponseDto.nowQueueSize);
    }

    return { status: 'ok' };
  }

  @SubscribeMessage('interest:youtube:play')
  async youtubePlay(@ConnectedSocket() client: Socket, @MessageBody() data: InterestsYoutubeControlDto) {
    const roomId = client.data.roomId;

    const correctedTime = await this.interestsService.getCorrectedTime(data.clientTimestamp, data.videoCurrentTime);

    const interestsYoutubeControlResponseDto = InterestsYoutubeControlResponseDto.of(INTERESTS_YOUTUBE_CONTROL.PLAY, {
      videoCurrentTime: correctedTime,
      playStatus: data.playStatus,
    });

    client.broadcast.to(roomId).emit('share:interest:youtube', interestsYoutubeControlResponseDto);
  }

  @SubscribeMessage('interest:youtube:stop')
  youtubeStop(@ConnectedSocket() client: Socket, @MessageBody() data: InterestsYoutubeControlDto) {
    const roomId = client.data.roomId;

    const interestsYoutubeControlResponseDto = InterestsYoutubeControlResponseDto.of(INTERESTS_YOUTUBE_CONTROL.STOP, {
      videoCurrentTime: data.videoCurrentTime,
      playStatus: data.playStatus,
    });

    client.broadcast.to(roomId).emit('share:interest:youtube', interestsYoutubeControlResponseDto);
  }

  @SubscribeMessage('interest:youtube:timeline')
  async youtubeChangeTimeline(@ConnectedSocket() client: Socket, @MessageBody() data: InterestsYoutubeControlDto) {
    const roomId = client.data.roomId;

    const correctedTargetTime =
      data.playStatus === 'play'
        ? await this.interestsService.getCorrectedTime(data.clientTimestamp, data.targetTime)
        : data.targetTime;

    const interestsYoutubeControlResponseDto = InterestsYoutubeControlResponseDto.of(
      INTERESTS_YOUTUBE_CONTROL.TIMELINE,
      {
        targetTime: correctedTargetTime,
      },
    );

    client.broadcast.to(roomId).emit('share:interest:youtube', interestsYoutubeControlResponseDto);
  }

  @SubscribeMessage('interest:youtube:speed')
  youtubeChangespeed(@ConnectedSocket() client: Socket, @MessageBody() data: InterestsYoutubeControlDto) {
    const roomId = client.data.roomId;

    const interestsYoutubeControlResponseDto = InterestsYoutubeControlResponseDto.of(INTERESTS_YOUTUBE_CONTROL.SPEED, {
      playSpeed: data.playSpeed,
    });

    client.broadcast.to(roomId).emit('share:interest:youtube', interestsYoutubeControlResponseDto);
  }

  @SubscribeMessage('interest:youtube:dragging')
  youtubeDragging(@ConnectedSocket() client: Socket) {
    const roomId = client.data.roomId;

    const interestsYoutubeControlResponseDto = InterestsYoutubeControlResponseDto.of(
      INTERESTS_YOUTUBE_CONTROL.DRAGGING,
    );

    client.broadcast.to(roomId).emit('share:interest:youtube', interestsYoutubeControlResponseDto);
  }

  @SubscribeMessage('interest:next')
  async next(@ConnectedSocket() client: Socket) {
    const roomId = client.data.roomId;
    const clientId = client.id;
    const hostFlag = this.roomsService.isHost(roomId, clientId);

    const interestsBroadcastResponseDto = await this.interestsService.next(roomId, hostFlag, clientId);

    this.server.to(roomId).emit('share:interest:broadcast', interestsBroadcastResponseDto);
  }
}
