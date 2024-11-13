import { Injectable } from '@nestjs/common';
import { EmpathyKeywordInfoDto, RESPONSE_STATUS } from '../dto/empathy.keyword.info.dto';
import * as AsyncLock from 'async-lock';
import { EmpathyKeywordAlertDto } from '../dto/empathy.keyword.alert.dto';

type SerializedEmpathyInfo = {
  questionId: number,
  keyword: string,
  participants: Set<string>
};

@Injectable()
export class EmpathyInMemoryRepository {
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

  async addKeyword(roomId: string, questionId: number, keyword: string, participantId: string): Promise<EmpathyKeywordInfoDto> {
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

      return new EmpathyKeywordInfoDto(questionId, keyword, RESPONSE_STATUS.PICK, participants.size);
    });
  }

  async removeKeyword(roomId: string, questionId: number, keyword: string, participantId: string): Promise<EmpathyKeywordInfoDto> {
    return await this.lock.acquire(`${ roomId }`, async () => {
      const participants = this.roomQuestionKeywordParticipants.get(roomId)?.get(questionId)?.get(keyword);
      participants?.delete(participantId);

      return new EmpathyKeywordInfoDto(questionId, keyword, RESPONSE_STATUS.RELEASE, participants?.size ?? 0);
    });
  }

  calculateStatistics(roomId: string): Map<string, EmpathyKeywordAlertDto[]> {
    const questionKeywordParticipants = this.roomQuestionKeywordParticipants.get(roomId);

    if (questionKeywordParticipants === undefined) {
      return new Map();
    }

    const sortedSerializedEmpathyInfos = this.serializeEmpathyInfos(questionKeywordParticipants)
      .sort(this.compareByParticipantsSize);

    this.roomQuestionKeywordParticipants.delete(roomId);

    return this.createStatistics(sortedSerializedEmpathyInfos);
  }

  private serializeEmpathyInfos(questionKeywordParticipants: Map<number, Map<string, Set<string>>>) {
    return Array.from(questionKeywordParticipants.entries())
      .reduce((result, [questionId, keywordParticipants]) => {
        const serializeEmpathyInfos = Array.from(keywordParticipants.entries())
          .map(([keyword, participants]) => {
            return { questionId, keyword, participants } as SerializedEmpathyInfo;
          });

        result.push(...serializeEmpathyInfos);

        return result;
      }, [] as SerializedEmpathyInfo[]);
  }

  private compareByParticipantsSize(a: SerializedEmpathyInfo, b: SerializedEmpathyInfo): number {
    return b.participants.size - a.participants.size;
  }

  private createStatistics(sortedEmpathyInfos: SerializedEmpathyInfo[]) {
    const statistics = new Map<string, EmpathyKeywordAlertDto[]>();

    for (const empathyInfo of sortedEmpathyInfos) {
      const alertDto = new EmpathyKeywordAlertDto(
        empathyInfo.questionId,
        empathyInfo.keyword,
        empathyInfo.participants.size
      );

      for (const participantId of empathyInfo.participants) {
        const participantStats = this.getOrCreateValue(
          statistics,
          participantId,
          () => new Array<EmpathyKeywordAlertDto>()
        );

        participantStats.push(alertDto);
      }
    }

    return statistics;
  }
}
