import { Injectable } from '@nestjs/common';
import { InterestsInMemoryRepository } from '../repository/interests.in-memory.repository';
import { Interest } from '../domain/interest';

@Injectable()
export class InterestsService {

  constructor(private readonly interestsInMemoryRepository: InterestsInMemoryRepository) {
  }

  async addInterest(roomId: string, interest: Interest) {
    return await this.interestsInMemoryRepository.checkAndEnqueueIfShared(roomId, interest);
  }

  async next(roomId: string, hostFlag: boolean, clientId: string) {
    return await this.interestsInMemoryRepository.next(roomId, hostFlag, clientId);
  }

  deleteRoomInterest(roomId: string) {
    this.interestsInMemoryRepository.deleteRoomInterest(roomId);
  }
}
