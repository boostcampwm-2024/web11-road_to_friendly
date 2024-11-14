import { Injectable } from '@nestjs/common';
import { KeywordsInfoDto, RESPONSE_STATUS } from '../dto/keywords.info.dto';
import * as AsyncLock from 'async-lock';
import { KeywordsAlertDto } from '../dto/keywords.alert.dto';

type SerializedKeywordInfo = {
  questionId: number,
  keyword: string,
  participants: Set<string>
};

const QUESTION_ID_KEYWORD_SEPARATOR = ':';

@Injectable()
export class KeywordsInMemoryRepository {
  private readonly roomKeywordsTotal = new Map<string, Map<string, Set<string>>>(); // 키워드 집합
  private readonly roomKeywordsStatistics = new Map<string, Map<string, KeywordsAlertDto[]>>(); // 키워드 통계
  private readonly lock = new AsyncLock();

  private getOrCreateValue<K, V>(map: Map<K, V>, key: K, defaultValueCalculator: () => V): V {
    let value = map.get(key);

    if (value === undefined) {
      value = defaultValueCalculator();
      map.set(key, value);
    }

    return value;
  }

  async addKeyword(roomId: string, questionId: number, keyword: string, participantId: string): Promise<KeywordsInfoDto> {
    return await this.lock.acquire(`${ roomId }:keyword`, async () => {
      const keywordsTotal = this.getOrCreateValue(
        this.roomKeywordsTotal,
        roomId,
        () => new Map<string, Set<string>>()
      );

      const selectors = this.getOrCreateValue(
        keywordsTotal,
        `${ questionId }${ QUESTION_ID_KEYWORD_SEPARATOR }${ keyword }`,
        () => new Set<string>()
      );

      selectors.add(participantId);

      return new KeywordsInfoDto(questionId, keyword, RESPONSE_STATUS.PICK, selectors.size);
    });
  }

  async removeKeyword(roomId: string, questionId: number, keyword: string, participantId: string): Promise<KeywordsInfoDto> {
    return await this.lock.acquire(`${ roomId }`, async () => {
      const selectors = this.roomKeywordsTotal.get(roomId)?.get(`${ questionId }${ QUESTION_ID_KEYWORD_SEPARATOR }${ keyword }`);
      selectors?.delete(participantId);

      return new KeywordsInfoDto(questionId, keyword, RESPONSE_STATUS.RELEASE, selectors?.size ?? 0);
    });
  }

  async getStatistics(roomId: string) {
    return await this.lock.acquire(`${ roomId }:statistics`, async () => {
      return this.roomKeywordsStatistics.get(roomId) ?? this.calculateStatistics(roomId);
    });
  }

  private calculateStatistics(roomId: string): Map<string, KeywordsAlertDto[]> {
    const keywordsTotal = this.roomKeywordsTotal.get(roomId);

    if (keywordsTotal === undefined) {
      return new Map();
    }

    const serializedKeywordsInfo = this.serializeKeywordsTotal(keywordsTotal)
      .sort(this.compareByParticipantsSize);

    const keywordsStatistics = this.createStatistics(serializedKeywordsInfo);
    this.roomKeywordsStatistics.set(roomId, keywordsStatistics);

    return keywordsStatistics;
  }

  private serializeKeywordsTotal(keywordsTotal: Map<string, Set<string>>) {
    return Array.from(keywordsTotal.entries())
      .reduce((result, [questionIdAndKeyword, participants]) => {
        const [questionId, keyword] = questionIdAndKeyword.split(QUESTION_ID_KEYWORD_SEPARATOR);

        const serializedKeywordInfo =
          { questionId: parseInt(questionId), keyword, participants } as SerializedKeywordInfo;

        result.push(serializedKeywordInfo);

        return result;
      }, [] as SerializedKeywordInfo[]);
  }

  private compareByParticipantsSize(a: SerializedKeywordInfo, b: SerializedKeywordInfo): number {
    return b.participants.size - a.participants.size;
  }

  private createStatistics(serializedKeywordsInfo: SerializedKeywordInfo[]) {
    const statistics = new Map<string, KeywordsAlertDto[]>();

    for (const keywordInfo of serializedKeywordsInfo) {
      const alertDto = new KeywordsAlertDto(
        keywordInfo.questionId,
        keywordInfo.keyword,
        keywordInfo.participants.size
      );

      for (const participantId of keywordInfo.participants) {
        const participantStats = this.getOrCreateValue(
          statistics,
          participantId,
          () => new Array<KeywordsAlertDto>()
        );

        participantStats.push(alertDto);
      }
    }

    return statistics;
  }

  deleteRoomKeywordsInfo(roomId: string) {
    this.roomKeywordsTotal.delete(roomId);
    this.roomKeywordsStatistics.delete(roomId);
  }
}
