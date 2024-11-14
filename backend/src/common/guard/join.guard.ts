import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JoinGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const roomId = client.data.roomId;

    if (roomId === undefined) {
      throw new WsException('방에 참가하지 않으셨습니다.');
    }

    return true;
  }
}
