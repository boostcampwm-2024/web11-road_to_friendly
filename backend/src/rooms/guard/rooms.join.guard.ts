import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RoomsService } from '../service/rooms.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JoinGuard implements CanActivate {
  constructor(private readonly roomsService: RoomsService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const roomId = client.data.roomId;

    if (roomId === undefined) {
      throw new WsException('방에 참가하지 않으셨습니다.');
    }

    return true;
  }
}
