import { Injectable } from '@nestjs/common';
import { Room } from '../entity/Room';
import { v4 as uuid } from 'uuid';
import { Socket } from 'socket.io';
import { RoomsJoinDto } from '../dto/rooms.join.dto';
import { Topic } from '../entity/Topic';

@Injectable()
export class RoomsService {
  private readonly rooms = new Map<string, Room>;

  create() {
    const roomId = uuid();
    this.rooms.set(roomId, new Room());
    return roomId;
  }

  isExistRoom(roomId: string) {
    return this.rooms.has(roomId);
  }

  isHost(client: Socket) {
    const roomId = client.data.roomId;
    const room = this.rooms.get(roomId);
    const { participantId: hostId } = room.getHostInfo();
    return hostId === client.id;
  }

  join(client: Socket, roomId: string): RoomsJoinDto {
    client.join(roomId);
    const room = this.rooms.get(roomId);

    client.data.roomId = roomId;
    client.data.nickname = this.randomNickname();
    return room.join(client);
  }

  private randomNickname() {
    const cho = Math.floor(Math.random() * 19);
    const jung = Math.floor(Math.random() * 21);
    const jong = Math.floor(Math.random() * 28);
    return String.fromCharCode(0xAC00 + 21 * 28 * cho + 28 * jung + jong);
  }

  exit(client: Socket, roomId: string) {
    const room = this.rooms.get(roomId);
    return room.exit(client);
  }

  getHostInfo(roomId: string) {
    const room = this.rooms.get(roomId);
    return room.getHostInfo();
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

    return randomTopicTitles.slice(0, count)
      .map((title, index) => new Topic(index + 1, title, (index + 1) * (topicSecond + topicTermSecond)));
  }
}
