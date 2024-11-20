import { Injectable } from '@nestjs/common';
import { InterestsManager } from '../operator/Interests.manager';
import { getOrCreateValue } from '../../common/util/get-or-create-value';
import { Interest } from '../domain/interest';
import * as AsyncLock from 'async-lock';
import { CustomException } from '../../common/exception/custom-exception';

@Injectable()
export class InterestsInMemoryRepository {
  private readonly roomInterest = new Map<string, InterestsManager>();
  private readonly lock = new AsyncLock();

  async checkAndEnqueueIfShared(roomId: string, interest: Interest) {
    return await this.lock.acquire(`${ roomId }:share`, async () => {
      const interestsManager = getOrCreateValue(this.roomInterest, roomId, () => new InterestsManager());
      return interestsManager.checkAndEnqueueIfShared(interest);
    });
  }

  async next(roomId: string, hostFlag: boolean, clientId: string) {
    return await this.lock.acquire(`${ roomId }:share`, async () => {
      const interestsManager = this.roomInterest.get(roomId);

      if (hostFlag || interestsManager.isMyInterest(clientId)) {
        return interestsManager.getNextInterest();
      }

      throw new CustomException('권한이 없습니다.');
    });
  }

  deleteRoomInterest(roomId: string) {
    this.roomInterest.delete(roomId);
  }
}
