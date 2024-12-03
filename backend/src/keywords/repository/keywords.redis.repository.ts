import { readFile } from 'node:fs/promises';

import Redis from 'ioredis';
import { OnModuleInit } from '@nestjs/common';

import { ACTION, KeywordsInfoDto } from '../dto/keywords.info.dto';
import { KeywordsAlertDto } from '../dto/keywords.alert.dto';


import { KeywordsRepository } from './keywords.repository';

export class KeywordsRedisRepository implements KeywordsRepository, OnModuleInit {
  private addKeywordEval: string;
  private removeKeywordEval: string;
  private statisticsKeywordEval: string;

  constructor(private readonly redis: Redis) {}

  async onModuleInit() {
    this.addKeywordEval = await this.cashScript(this.redis, 'src/keywords/script/add.keyword.lua');
    this.removeKeywordEval = await this.cashScript(this.redis, 'src/keywords/script/remove.keyword.lua');
    this.statisticsKeywordEval = await this.cashScript(this.redis, 'src/keywords/script/statistics.keyword.lua');
  }

  private async cashScript(redis: Redis, path: string) {
    const luaScript = await readFile(path, 'utf-8');
    return redis.script('LOAD', luaScript) as unknown as string;
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
    const result = await this.redis.evalsha(this.statisticsKeywordEval, 1, roomId);
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
