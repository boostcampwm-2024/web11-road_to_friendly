import { Injectable } from '@nestjs/common';
import { Room } from '../entity/Room';
import { v4 as uuid } from 'uuid';
import { Socket } from 'socket.io';
import { RoomsJoinDto } from '../dto/rooms.join.dto';

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
}
