import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { KeywordsRequestDto } from '../dto/keywords.request.dto';
import { KeywordsResponseDto } from '../dto/keywords.response.dto';
import { KeywordsService } from '../service/keywords.service';
import { KeywordsAlertDto } from '../dto/keywords.alert.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class KeywordsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly keywordsService: KeywordsService) {
  }

  @SubscribeMessage('keyword:pick')
  async pickKeyword(@ConnectedSocket() client: Socket, @MessageBody() {
    questionId,
    keyword
  }: KeywordsRequestDto): Promise<KeywordsResponseDto> {
    const roomId = client.data.roomId;
    const clientId = client.id;
    const keywordsInfoDto = await this.keywordsService.addKeyword(roomId, questionId, keyword, clientId);

    this.server.to(roomId).emit('empathy:keyword:count', KeywordsAlertDto.of(keywordsInfoDto));

    return new KeywordsResponseDto(keywordsInfoDto);
  }

  @SubscribeMessage('keyword:release')
  async releaseKeyword(@ConnectedSocket() client: Socket, @MessageBody() {
    questionId,
    keyword
  }: KeywordsRequestDto): Promise<KeywordsResponseDto> {
    const roomId = client.data.roomId;
    const clientId = client.id;
    const keywordsInfoDto = await this.keywordsService.removeKeyword(roomId, questionId, keyword, clientId);

    this.server.to(roomId).emit('empathy:keyword:count', KeywordsAlertDto.of(keywordsInfoDto));

    return new KeywordsResponseDto(keywordsInfoDto);
  }

  @SubscribeMessage('keyword:result')
  async broadcastKeywordStatistics(@ConnectedSocket() client: Socket) {
    const roomId = client.data.roomId;
    const statics = await this.keywordsService.getStatistics(roomId);
    return Array.from(statics.entries());
  }
}
