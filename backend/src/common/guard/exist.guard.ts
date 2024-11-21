import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RoomsService } from '../../rooms/service/rooms.service';
import { CustomException } from '../exception/custom-exception';

@Injectable()
export class ExistGuard implements CanActivate {
  constructor(private readonly roomsService: RoomsService) {
  }

  canActivate(context: ExecutionContext) {
    const { roomId } = context.switchToWs().getData();

    if (!this.roomsService.isExistRoom(roomId)) {
      throw new CustomException('존재하지 않는 방입니다.');
    }

    return true;
  }
}
