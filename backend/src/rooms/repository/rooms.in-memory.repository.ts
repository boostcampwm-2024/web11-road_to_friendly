import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

export enum RoomPhase {
  WAITING = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
}

interface Room {
  roomId: string;
  phase: RoomPhase;
  hostId: string;
}

@Injectable()
export class RoomsInMemoryRepository {
  private readonly rooms = new Map<string, Room>();

  async create(): Promise<string> {
    const roomId = uuid();
    const newRoom: Room = {
      roomId: roomId,
      phase: RoomPhase.WAITING,
      hostId: '',
    };
    this.rooms.set(roomId, newRoom);
    return roomId;
  }

  async isExistRoom(roomId: string): Promise<boolean> {
    return this.rooms.has(roomId);
  }

  async join(roomId: string, clientId: string): Promise<string> {
    const room = this.rooms.get(roomId);

    if (!room.hostId) room.hostId = clientId;

    return room.hostId;
  }

  isHost(roomId: string) {
    const room = this.rooms.get(roomId);
    return room.hostId;
  }
}
