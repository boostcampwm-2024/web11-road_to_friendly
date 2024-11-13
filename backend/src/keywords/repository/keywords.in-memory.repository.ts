import { Injectable } from '@nestjs/common';
import { KeywordsInfoDto, RESPONSE_STATUS } from '../dto/keywords.info.dto';
import * as AsyncLock from 'async-lock';
import { KeywordsAlertDto } from '../dto/keywords.alert.dto';

type SerializedKeywordInfo = {
  questionId: number,
  keyword: string,
  participants: Set<string>
};

@Injectable()
export class KeywordsInMemoryRepository {
  private readonly roomQuestionKeywordParticipants = new Map<string, Map<number, Map<string, Set<string>>>>();
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
    return await this.lock.acquire(`${ roomId }`, async () => {
      const questionKeywordParticipants = this.getOrCreateValue(
        this.roomQuestionKeywordParticipants,
        roomId,
        () => new Map<number, Map<string, Set<string>>>()
      );

      const keywordParticipants = this.getOrCreateValue(
        questionKeywordParticipants,
        questionId,
        () => new Map<string, Set<string>>()
      );

      const participants = this.getOrCreateValue(keywordParticipants, keyword, () => new Set<string>());
      participants.add(participantId);

      return new KeywordsInfoDto(questionId, keyword, RESPONSE_STATUS.PICK, participants.size);
    });
  }

  async removeKeyword(roomId: string, questionId: number, keyword: string, participantId: string): Promise<KeywordsInfoDto> {
    return await this.lock.acquire(`${ roomId }`, async () => {
      const participants = this.roomQuestionKeywordParticipants.get(roomId)?.get(questionId)?.get(keyword);
      participants?.delete(participantId);

      return new KeywordsInfoDto(questionId, keyword, RESPONSE_STATUS.RELEASE, participants?.size ?? 0);
    });
  }

  calculateStatistics(roomId: string): Map<string, KeywordsAlertDto[]> {
    const questionKeywordParticipants = this.roomQuestionKeywordParticipants.get(roomId);

    if (questionKeywordParticipants === undefined) {
      return new Map();
    }

    const serializedKeywordInfos = this.serializeKeywordsInfo(questionKeywordParticipants)
      .sort(this.compareByParticipantsSize);

    this.roomQuestionKeywordParticipants.delete(roomId);

    return this.createStatistics(serializedKeywordInfos);
  }

  private serializeKeywordsInfo(questionKeywordParticipants: Map<number, Map<string, Set<string>>>) {
    return Array.from(questionKeywordParticipants.entries())
      .reduce((result, [questionId, keywordParticipants]) => {
        const serializedKeywordsInfo = Array.from(keywordParticipants.entries())
          .map(([keyword, participants]) => {
            return { questionId, keyword, participants } as SerializedKeywordInfo;
          });

        result.push(...serializedKeywordsInfo);

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
}
