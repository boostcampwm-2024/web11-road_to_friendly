import { Inject, Injectable } from '@nestjs/common';

import { Interest } from '../domain/interest';
import { InterestsRepository } from '../repository/interests.repository';
import { InterestsImageDto } from '../dto/interests.image.dto';
import { TIME_UNITS } from '../definition/time.unit';
import { InterestsImageRepository } from '../repository/interests.image.repository';

@Injectable()
export class InterestsService {
  constructor(
    private readonly interestsRepository: InterestsRepository,
    @Inject('INTERESTS_IMAGE_REPOSITORY') private readonly interestsImageRepository: InterestsImageRepository,
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
    return await this.interestsImageRepository.uploadImage(data);
  }

  async getCorrectedSeconds(clientTimestamp: number, currentTime: number) {
    const serverTimestamp = Date.now();
    const timeDifference = serverTimestamp - clientTimestamp;
    return currentTime + timeDifference / TIME_UNITS.MILLISECONDS_TO_SECOND;
  }
}
