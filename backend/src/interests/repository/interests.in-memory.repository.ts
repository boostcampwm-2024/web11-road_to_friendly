import { Injectable } from '@nestjs/common';
import * as AsyncLock from 'async-lock';

import { InterestsManager } from '../operator/Interests.manager';
import { getOrCreateValue } from '../../common/util/get-or-create-value';
import { Interest } from '../domain/interest';
import { CustomException } from '../../common/exception/custom-exception';
import { InterestsBroadcastResponseDto } from '../dto/interests.broadcast.response.dto';

@Injectable()
export class InterestsInMemoryRepository {
  private readonly roomInterest = new Map<string, InterestsManager>();
  private readonly lock = new AsyncLock();

  async addInterestIfBroadcasting(roomId: string, interest: Interest) {
    return await this.lock.acquire(`${ roomId }:share`, async () => {
      const interestsManager = getOrCreateValue(this.roomInterest, roomId, () => new InterestsManager());
      const nowQueueSize = interestsManager.addInterestIfBroadcasting(interest);
      return InterestsBroadcastResponseDto.of(interest, nowQueueSize);
    });
  }

  async next(roomId: string, hostFlag: boolean, clientId: string) {
    return await this.lock.acquire(`${ roomId }:share`, async () => {
      const interestsManager = this.roomInterest.get(roomId);

      if (hostFlag || interestsManager.isMyInterest(clientId)) {
        const nextInterest = interestsManager.getNextInterest();
        const nowQueueSize = interestsManager.getQueueSize();
        return InterestsBroadcastResponseDto.of(nextInterest, nowQueueSize);
      }

      throw new CustomException('권한이 없습니다.');
    });
  }

  deleteRoomInterest(roomId: string) {
    this.roomInterest.delete(roomId);
  }
}
