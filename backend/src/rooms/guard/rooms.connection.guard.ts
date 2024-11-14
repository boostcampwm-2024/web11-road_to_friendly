import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ConnectionGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    if (client.rooms.size !== 1) {
      throw new WsException('이미 접속한 방이 존재합니다.');
    }

    return true;
  }
}
