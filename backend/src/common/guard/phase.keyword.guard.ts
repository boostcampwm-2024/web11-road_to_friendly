import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RoomsService } from '../../rooms/service/rooms.service';
import { Phase, PHASE } from '../definition/phase';
import { CustomException } from '../exception/custom-exception';

export abstract class AbstractPhaseGuard implements CanActivate {
  protected constructor(
    private readonly roomsService: RoomsService,
    private readonly phase: Phase
  ) {
  }

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const roomId = client.data.roomId;

    if (!this.roomsService.isPhase(roomId, this.phase)) {
      throw new CustomException('현재 방 상태에서 허용되지 않는 명령입니다.');
    }

    return true;
  }
}

@Injectable()
export class PhaseKeywordGuard extends AbstractPhaseGuard {
  constructor(roomsService: RoomsService) {
    super(roomsService, PHASE.KEYWORD);
  }
}

@Injectable()
export class PhaseInterestGuard extends AbstractPhaseGuard {
  constructor(roomsService: RoomsService) {
    super(roomsService, PHASE.INTEREST);
  }
}
