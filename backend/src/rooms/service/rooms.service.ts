import { Inject, Injectable } from '@nestjs/common';

import { Topic } from '../entity/Topic';
import { PHASE, Phase } from '../../common/definition/phase';
import { KeywordsAlertDto } from '../../keywords/dto/keywords.alert.dto';
import { RoomsRepository } from '../repository/rooms.repository';
import { KeywordsRepository } from '../../keywords/repository/keywords.repository';

@Injectable()
export class RoomsService {
  constructor(
    @Inject('ROOMS_REPOSITORY')
    private readonly roomsRepository: RoomsRepository,
    @Inject('KEYWORDS_REPOSITORY')
    private readonly keywordsRepository: KeywordsRepository,
  ) {}

  async create() {
    return await this.roomsRepository.create();
  }

  async isExistRoom(roomId: string) {
    return await this.roomsRepository.isExistRoom(roomId);
  }

  async isHost(roomId: string, clientId: string) {
    const hostId = await this.roomsRepository.getHostId(roomId);
    return hostId === clientId;
  }

  setHostIfHostUndefined(roomId: string, clientId: string) {
    return this.roomsRepository.setHostIfHostUndefined(roomId, clientId);
  }

  getHostId(roomId: string) {
    return this.roomsRepository.getHostId(roomId);
  }

  private readonly topicTitles: string[] = [
    '좋아하는 음식은?',
    '좋아하는 노래는?',
    '좋아하는 아티스트는?',
    '좋아하는 동물은?',
    '좋아하는 게임은?',
  ];

  getEmpathyTopics(count = 5, topicSecond = 1, topicTermSecond = 1) {
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
    this.roomsRepository.deleteRoom(roomId);
  }

  setHost(roomId: string, nextHostId: string) {
    this.roomsRepository.updateHost(roomId, nextHostId);
  }

  async isPhase(roomId: string, phase: Phase) {
    return (await this.roomsRepository.getPhase(roomId)) === phase;
  }

  setPhase(roomId: string, phase: Phase) {
    return this.roomsRepository.setPhase(roomId, phase);
  }

  async generateBroadcastStatisticsEvent(
    roomId: string,
    finishTime: string,
    broadcastStatistics: (roomId: string, statistics: Record<string, KeywordsAlertDto[]>) => void,
  ) {
    const finishTimestamp = new Date(finishTime).getTime();
    const delay = finishTimestamp - Date.now();

    setTimeout(async () => {
      const broadcastFlag = this.setPhase(roomId, PHASE.INTEREST);

      if (broadcastFlag) {
        const statistics = await this.keywordsRepository.getStatistics(roomId);
        broadcastStatistics(roomId, statistics);
      }
    }, delay);
  }
}
