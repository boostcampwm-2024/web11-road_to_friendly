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
    private readonly keywordsInMemoryRepository: KeywordsInMemoryRepository
  ) {
  }

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
  ];

  getEmpathyTopics(count = 5, topicSecond = 60, topicTermSecond = 1) {
    count = Math.min(this.topicTitles.length, count);

    const randomTopicTitles = [...this.topicTitles];

    for (let i = randomTopicTitles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [randomTopicTitles[i], randomTopicTitles[j]] = [randomTopicTitles[j], randomTopicTitles[i]];
    }

    return randomTopicTitles
      .slice(0, count)
      .map((title, index) => new Topic(index + 1, title, (index + 1) * (topicSecond + topicTermSecond)));
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
    this.roomsInMemoryRepository.setPhase(roomId, phase);
  }

  generateBroadcastStatisticsEvent(roomId: string, finishTime: string, broadcastStatistics: (roomId: string, statistics: Map<string, KeywordsAlertDto[]>) => void) {
    const finishTimestamp = new Date(finishTime).getTime();
    const delay = finishTimestamp - Date.now();

    setTimeout(async () => {
      this.setPhase(roomId, PHASE.STATISTICS);
      const statistics = await this.keywordsInMemoryRepository.getStatistics(roomId);
      broadcastStatistics(roomId, statistics);
    }, delay);
  }
}
