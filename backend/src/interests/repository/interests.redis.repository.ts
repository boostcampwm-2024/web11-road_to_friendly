import { InterestsRepository } from './interests.repository';
import { Interest } from '../domain/interest';
import { InterestsBroadcastResponseDto } from '../dto/interests.broadcast.response.dto';
import Redis from 'ioredis';
import { OnModuleInit } from '@nestjs/common';
import { cashLuaScript } from '../../common/util/cash-lua-script';
import { CustomException } from '../../common/exception/custom-exception';

export class InterestsRedisRepository implements InterestsRepository, OnModuleInit {
  private addInterestEval: string;
  private nextInterestEval: string;

  constructor(private readonly redis: Redis) {}

  async onModuleInit() {
    this.addInterestEval = await cashLuaScript(this.redis, 'src/interests/script/add.interest.lua');
    this.nextInterestEval = await cashLuaScript(this.redis, 'src/interests/script/next.interest.lua');
  }

  async addInterestIfBroadcasting(roomId: string, interest: Interest): Promise<InterestsBroadcastResponseDto> {
    const nowQueueSize = (await this.redis.evalsha(
      this.addInterestEval,
      2,
      `rooms:${roomId}:interests:share`,
      `rooms:${roomId}:interests:queue`,
      interest.clientId,
      interest.resourceType,
      interest.resourceUrl,
    )) as number;

    return InterestsBroadcastResponseDto.of(interest, nowQueueSize);
  }

  deleteRoomInterest(roomId: string): void {
    this.redis.del(`rooms:${roomId}:interests:*`);
  }

  async next(roomId: string, hostFlag: boolean, clientId: string): Promise<InterestsBroadcastResponseDto> {
    try {
      const [nextInterest, nowQueueSize] = (await this.redis.evalsha(
        this.nextInterestEval,
        2,
        `rooms:${roomId}:interests:share`,
        `rooms:${roomId}:interests:queue`,
        Number(hostFlag),
        clientId,
      )) as [string, number];

      return InterestsBroadcastResponseDto.of(JSON.parse(nextInterest), nowQueueSize);
    } catch (error) {
      throw new CustomException(error.message);
    }
  }
}
