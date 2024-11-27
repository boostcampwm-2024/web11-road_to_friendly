import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { RoomsService } from '../../rooms/service/rooms.service';
import { CustomException } from '../exception/custom-exception';

@Injectable()
export class HostGuard implements CanActivate {
  constructor(private readonly roomsService: RoomsService) {
  }

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const roomId = client.data.roomId;

    if (!this.roomsService.isHost(roomId, client.id)) {
      throw new CustomException('호스트가 아닙니다.');
    }

    return true;
  }
}
