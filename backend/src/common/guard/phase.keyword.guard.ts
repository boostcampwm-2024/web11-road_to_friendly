import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PHASE } from '../definition/phase';
import { RoomsService } from '../../rooms/service/rooms.service';
import { CustomException } from '../exception/custom-exception';

@Injectable()
export class PhaseKeywordGuard implements CanActivate {

  constructor(private readonly roomsService: RoomsService) {
  }

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const roomId = client.data.roomId;

    if (!this.roomsService.isPhase(roomId, PHASE.KEYWORD)) {
      throw new CustomException('현재 방 상태에서 허용되지 않는 명령입니다.');
    }

    return true;
  }
}
