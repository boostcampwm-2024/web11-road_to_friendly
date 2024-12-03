import { v4 as uuid } from 'uuid';

import { PHASE, Phase } from '../../common/definition/phase';
import { Room } from '../definition/room';
import { RoomsRepository } from './rooms.repository';
import Redis from 'ioredis';

export class RoomsRedisRepository implements RoomsRepository {
  constructor(private readonly redis: Redis) {}

  async create() {
    const roomId = uuid();
    const newRoom: Partial<Room> = {
      phase: PHASE.READY,
    };

    await this.redis.hset(`rooms:${roomId}`, newRoom);

    return roomId;
  }

  async isExistRoom(roomId: string) {
    const value = await this.redis.exists(`rooms:${roomId}`);
    return value > 0;
  }

  async setHostIfHostUndefined(roomId: string, clientId: string) {
    const transaction = this.redis.multi();
    const key = `rooms:${roomId}`;
    const field = 'hostId';

    transaction.hsetnx(key, field, clientId);
    transaction.hget(key, field);

    const [[hashSetNxError, hashSetNxResult], [hashGetError, hashGetResult]] = await transaction.exec();

    return hashGetResult.toString();
  }

  getHostId(roomId: string) {
    return this.redis.hget(`rooms:${roomId}`, 'hostId');
  }

  changeRoomPhase(roomId: string, newPhase: Phase) {
    this.redis.hsetnx(`rooms:${roomId}`, 'phase', newPhase);
  }

  async getPhase(roomId: string) {
    return (await this.redis.hget(`rooms:${roomId}`, 'phase')) as Phase;
  }

  async setPhase(roomId: string, phase: Phase) {
    const result = await this.redis.hset(`rooms:${roomId}`, 'phase', phase);

    return result > 0;
  }

  deleteRoom(roomId: string) {
    this.redis.del(`rooms:${roomId}`);
  }

  updateHost(roomId: string, nextHostId: string) {
    this.redis.hset(`rooms:${roomId}`, 'hostId', nextHostId);
  }
}
