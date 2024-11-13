import { Injectable } from '@nestjs/common';
import { Room } from '../entity/Room';
import { v4 as uuid } from 'uuid';
import { Socket } from 'socket.io';
import { RoomsJoinDto } from '../dto/rooms.join.dto';
import { Topic } from '../entity/Topic';
import { RoomsInMemoryRepository } from '../repository/rooms.in-memory.repository';

@Injectable()
export class RoomsService {
  private readonly rooms = new Map<string, Room>();

  constructor(private readonly roomsInMemoryRepository: RoomsInMemoryRepository) {}

  async create(): Promise<string> {
    return await this.roomsInMemoryRepository.create();
  }

  async isExistRoom(roomId: string): Promise<boolean> {
    return await this.roomsInMemoryRepository.isExistRoom(roomId);
  }

  isHost(roomId: string, clientId: string) {
    const hostId = this.roomsInMemoryRepository.isHost(roomId);
    return hostId === clientId;
  }

  async join(roomId: string, clientId: string): Promise<string> {
    return await this.roomsInMemoryRepository.join(roomId, clientId);
  }

  getHostInfo(roomId: string) {
    return this.roomsInMemoryRepository.isHost(roomId);
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
}
