import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RoomsService } from '../service/rooms.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ExistGuard implements CanActivate {
  constructor(private readonly roomsService: RoomsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const roomId = client.data.roomId;

    if (!(await this.roomsService.isExistRoom(roomId))) {
      throw new WsException('존재하지 않는 방입니다.');
    }

    return true;
  }
}
