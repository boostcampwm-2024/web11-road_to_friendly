import { Inject, Injectable } from '@nestjs/common';

import { Interest } from '../domain/interest';
import { InterestsRepository } from '../repository/interests.repository';
import { InterestsImageDto } from '../dto/interests.image.dto';
import { TIME_UNITS } from '../definition/time.unit';
import { InterestsImageRepository } from '../repository/interests.image.repository';
import { InterestsInMemoryRepository } from '../repository/interests.in-memory.repository';

@Injectable()
export class InterestsService {
  constructor(
    private readonly interestsInMemoryRepository: InterestsInMemoryRepository, // redis 사용시 분리
    @Inject('INTERESTS_IMAGE_REPOSITORY') private readonly interestsImageRepository: InterestsImageRepository,
  ) {}

  addInterest(roomId: string, interest: Interest) {
    return this.interestsInMemoryRepository.addInterestIfBroadcasting(roomId, interest);
  }

  next(roomId: string, hostFlag: boolean, clientId: string) {
    return this.interestsInMemoryRepository.next(roomId, hostFlag, clientId);
  }

  deleteRoomInterest(roomId: string) {
    this.interestsInMemoryRepository.deleteRoomInterest(roomId);
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
