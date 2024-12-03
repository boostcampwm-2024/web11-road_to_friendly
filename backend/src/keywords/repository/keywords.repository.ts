import { KeywordsInfoDto } from '../dto/keywords.info.dto';
import { KeywordsAlertDto } from '../dto/keywords.alert.dto';

export interface KeywordsRepository {
  addKeyword(roomId: string, questionId: number, keyword: string, participantId: string): Promise<KeywordsInfoDto>;
  removeKeyword(roomId: string, questionId: number, keyword: string, participantId: string): Promise<KeywordsInfoDto>;
  getStatistics(roomId: string): Promise<Record<string, KeywordsAlertDto[]>>;
  deleteRoomKeywordsInfo(roomId: string): void;
}
