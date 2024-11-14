import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ROOM_PHASE } from '../../common/definition/phase';
import { Room } from '../../common/definition/room';

@Injectable()
export class RoomsInMemoryRepository {
  private readonly rooms = new Map<string, Room>();

  create() {
    const roomId = uuid();
    const newRoom: Room = {
      roomId: roomId,
      phase: ROOM_PHASE.WAITING,
      hostId: '',
    };

    this.rooms.set(roomId, newRoom);

    return roomId;
  }

  isExistRoom(roomId: string) {
    return this.rooms.has(roomId);
  }

  setHostIfHostUndefined(roomId: string, clientId: string) {
    const room = this.rooms.get(roomId);

    if (!room.hostId) {
      room.hostId = clientId;
    }

    return room.hostId;
  }

  getHostId(roomId: string) {
    const room = this.rooms.get(roomId);
    return room.hostId;
  }

  changeRoomPhase(roomId: string, newPhase: ROOM_PHASE) {
    const room = this.rooms.get(roomId);

    if (!room) {
      return;
    }

    room.phase = newPhase;
  }

  deleteRoom(roomId: string) {
    this.rooms.delete(roomId);
  }

  updateHost(roomId: string, nextHostId: string) {
    this.rooms.get(roomId).hostId = nextHostId;
  }
}
