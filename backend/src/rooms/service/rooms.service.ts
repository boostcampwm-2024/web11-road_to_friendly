import { Injectable } from '@nestjs/common';

import { Topic } from '../entity/Topic';
import { RoomsInMemoryRepository } from '../repository/rooms.in-memory.repository';
import { PHASE, Phase } from '../../common/definition/phase';
import { KeywordsAlertDto } from '../../keywords/dto/keywords.alert.dto';
import { KeywordsInMemoryRepository } from '../../keywords/repository/keywords.in-memory.repository';

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomsInMemoryRepository: RoomsInMemoryRepository,
    private readonly keywordsInMemoryRepository: KeywordsInMemoryRepository,
  ) {}

  create() {
    return this.roomsInMemoryRepository.create();
  }

  isExistRoom(roomId: string) {
    return this.roomsInMemoryRepository.isExistRoom(roomId);
  }

  isHost(roomId: string, clientId: string) {
    const hostId = this.roomsInMemoryRepository.getHostId(roomId);
    return hostId === clientId;
  }

  setHostIfHostUndefined(roomId: string, clientId: string) {
    return this.roomsInMemoryRepository.setHostIfHostUndefined(roomId, clientId);
  }

  getHostId(roomId: string) {
    return this.roomsInMemoryRepository.getHostId(roomId);
  }

  private readonly topicTitles: string[] = [
    '좋아하는 음식은?',
    '좋아하는 노래는?',
    '좋아하는 아티스트는?',
    '좋아하는 동물은?',
    '좋아하는 게임은?',
    '좋아하는 유튜버는?',
    '좋아하는 영화는?',
    '좋아하는 드라마는?',
    '가고 싶은 여행지는?',
    '좋아하는, 혹은 배워 보고 싶은 취미는?',
    '좋아하는 운동은?',
    '좋아하는 책은?',
  ];

  getEmpathyTopics(count = 5, topicSecond = 60, topicTermSecond = 1): Topic[] {
    count = Math.min(this.topicTitles.length, count);

    const uniqueNumbers = new Set<number>();

    while (uniqueNumbers.size < count) {
      const randomNum = Math.floor(Math.random() * this.topicTitles.length);
      uniqueNumbers.add(randomNum);
    }

    return Array.from(uniqueNumbers).map(
      (randomNumber, index) =>
        new Topic(index + 1, this.topicTitles[randomNumber], (index + 1) * (topicSecond + topicTermSecond)),
    );
  }

  deleteRoom(roomId: string) {
    this.roomsInMemoryRepository.deleteRoom(roomId);
  }

  setHost(roomId: string, nextHostId: string) {
    this.roomsInMemoryRepository.updateHost(roomId, nextHostId);
  }

  isPhase(roomId: string, phase: Phase) {
    return this.roomsInMemoryRepository.getPhase(roomId) === phase;
  }

  setPhase(roomId: string, phase: Phase) {
    return this.roomsInMemoryRepository.setPhase(roomId, phase);
  }

  generateBroadcastStatisticsEvent(
    roomId: string,
    finishTime: string,
    broadcastStatistics: (roomId: string, statistics: Record<string, KeywordsAlertDto[]>) => void,
  ) {
    const finishTimestamp = new Date(finishTime).getTime();
    const delay = finishTimestamp - Date.now();

    setTimeout(async () => {
      const broadcastFlag = this.setPhase(roomId, PHASE.INTEREST);

      if (broadcastFlag) {
        const statistics = await this.keywordsInMemoryRepository.getStatistics(roomId);
        broadcastStatistics(roomId, statistics);
      }
    }, delay);
  }
}
