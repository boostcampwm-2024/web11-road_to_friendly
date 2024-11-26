import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { PHASE, Phase } from '../../common/definition/phase';
import { Room } from '../definition/room';

@Injectable()
export class RoomsInMemoryRepository {
  private readonly rooms = new Map<string, Room>();

  create() {
    const roomId = uuid();
    const newRoom: Room = {
      roomId: roomId,
      phase: PHASE.READY,
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

  changeRoomPhase(roomId: string, newPhase: Phase) {
    const room = this.rooms.get(roomId);

    if (!room) {
      return;
    }

    room.phase = newPhase;
  }

  getPhase(roomId: string) {
    return this.rooms.get(roomId)?.phase;
  }

  setPhase(roomId: string, phase: Phase) {
    this.rooms.get(roomId).phase = phase;
  }

  deleteRoom(roomId: string) {
    this.rooms.delete(roomId);
  }

  updateHost(roomId: string, nextHostId: string) {
    this.rooms.get(roomId).hostId = nextHostId;
  }
}
