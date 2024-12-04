import Redis from 'ioredis';
import { OnModuleInit } from '@nestjs/common';

import { ACTION, KeywordsInfoDto } from '../dto/keywords.info.dto';
import { KeywordsAlertDto } from '../dto/keywords.alert.dto';

import { KeywordsRepository } from './keywords.repository';
import { cashLuaScript } from '../../common/util/cash-lua-script';

export class KeywordsRedisRepository implements KeywordsRepository, OnModuleInit {
  private addKeywordEval: string;
  private removeKeywordEval: string;
  private statisticsKeywordEval: string;

  constructor(private readonly redis: Redis) {}

  async onModuleInit() {
    this.addKeywordEval = await cashLuaScript(this.redis, 'src/keywords/script/add.keyword.lua');
    this.removeKeywordEval = await cashLuaScript(this.redis, 'src/keywords/script/remove.keyword.lua');
    this.statisticsKeywordEval = await cashLuaScript(this.redis, 'src/keywords/script/statistics.keyword.lua');
  }

  async addKeyword(roomId: string, questionId: number, keyword: string, participantId: string) {
    const count = await this.redis.evalsha(
      this.addKeywordEval,
      2,
      `rooms:${roomId}:questions:${questionId}:keywords:${keyword}`,
      `rooms:${roomId}:statistics`,
      participantId,
      `questions:${questionId}:keywords:${keyword}`,
    );

    return new KeywordsInfoDto(questionId, keyword, ACTION.PICK, Number(count));
  }

  deleteRoomKeywordsInfo(roomId: string): void {
    this.redis.del(`rooms:${roomId}:questions:*`, `rooms:${roomId}:statistics`);
  }

  async getStatistics(roomId: string) {
    const result = await this.redis.evalsha(this.statisticsKeywordEval, 1, `rooms:${roomId}:statistics`);
    return JSON.parse(result as string) as Record<string, KeywordsAlertDto[]>;
  }

  async removeKeyword(roomId: string, questionId: number, keyword: string, participantId: string) {
    const count = await this.redis.evalsha(
      this.removeKeywordEval,
      2,
      `rooms:${roomId}:questions:${questionId}:keywords:${keyword}`,
      `rooms:${roomId}:statistics`,
      participantId,
      `questions:${questionId}:keywords:${keyword}`,
    );

    return new KeywordsInfoDto(questionId, keyword, ACTION.RELEASE, Number(count));
  }
}
