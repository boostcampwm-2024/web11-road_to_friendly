import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CustomException } from '../exception/custom-exception';

@Injectable()
export class ConnectGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    if (client.rooms.size !== 1) {
      throw new CustomException('이미 접속한 방이 존재합니다.');
    }

    return true;
  }
}
