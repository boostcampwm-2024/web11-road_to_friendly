import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EmpathyKeywordRequestDto } from '../dto/empathy.keyword.request.dto';
import { EmpathyKeywordResponseDto } from '../dto/empathy.keyword.response.dto';
import { EmpathyService } from '../service/empathy.service';
import { EmpathyKeywordAlertDto } from '../dto/empathy.keyword.alert.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  namespace: 'empathy'
})
export class EmpathyGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly empathyService: EmpathyService) {
  }

  @SubscribeMessage('keyword:pick')
  async pickKeyword(@ConnectedSocket() client: Socket, @MessageBody() {
    questionId,
    keyword
  }: EmpathyKeywordRequestDto): Promise<EmpathyKeywordResponseDto> {
    const roomId = client.data.roomId;
    const clientId = client.id;
    const empathyKeywordInfoDto = await this.empathyService.addKeyword(roomId, questionId, keyword, clientId);

    this.server.to(roomId).emit('empathy:keyword:count', EmpathyKeywordAlertDto.ofEmpathyKeywordInfo(empathyKeywordInfoDto));

    return new EmpathyKeywordResponseDto(empathyKeywordInfoDto);
  }

  @SubscribeMessage('keyword:release')
  async releaseKeyword(@ConnectedSocket() client: Socket, @MessageBody() {
    questionId,
    keyword
  }: EmpathyKeywordRequestDto): Promise<EmpathyKeywordResponseDto> {
    const roomId = client.data.roomId;
    const clientId = client.id;
    const empathyKeywordInfoDto = await this.empathyService.removeKeyword(roomId, questionId, keyword, clientId);

    this.server.to(roomId).emit('empathy:keyword:count', EmpathyKeywordAlertDto.ofEmpathyKeywordInfo(empathyKeywordInfoDto));

    return new EmpathyKeywordResponseDto(empathyKeywordInfoDto);
  }

  @SubscribeMessage('keyword:result')
  broadcastKeywordStatistics(@ConnectedSocket() client: Socket) {
    const roomId = client.data.roomId;
    const statistics = this.empathyService.getStatistics(roomId);

    this.server.to(roomId).emit('empathy:keyword:result', statistics);
  }
}
