import { Inject, Injectable } from '@nestjs/common';

import { Interest } from '../domain/interest';
import { InterestsRepository } from '../repository/interests.repository';
import { InterestsImageDto } from '../dto/interests.image.dto';
import { TIME_UNITS } from '../definition/time.unit';

@Injectable()
export class InterestsService {
  constructor(
    @Inject('INTERESTS_REPOSITORY')
    private readonly interestsRepository: InterestsRepository,
  ) {}

  addInterest(roomId: string, interest: Interest) {
    return this.interestsRepository.addInterestIfBroadcasting(roomId, interest);
  }

  next(roomId: string, hostFlag: boolean, clientId: string) {
    return this.interestsRepository.next(roomId, hostFlag, clientId);
  }

  deleteRoomInterest(roomId: string) {
    this.interestsRepository.deleteRoomInterest(roomId);
  }

  async uploadImage(data: InterestsImageDto) {
    return await this.interestsRepository.uploadImage(data);
  }

  async getCorrectedSeconds(clientTimestamp: number, currentTime: number) {
    const serverTimestamp = Date.now();
    const timeDifference = serverTimestamp - clientTimestamp;
    return currentTime + timeDifference / TIME_UNITS.MILLISECONDS_TO_SECOND;
  }
}
