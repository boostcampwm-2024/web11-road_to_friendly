import { Injectable } from '@nestjs/common';

import { KeywordsInMemoryRepository } from '../repository/keywords.in-memory.repository';
import { KeywordsInfoDto } from '../dto/keywords.info.dto';

@Injectable()
export class KeywordsService {
  constructor(private readonly keywordsInMemoryRepository: KeywordsInMemoryRepository) {}

  addKeyword(roomId: string, questionId: number, keyword: string, clientId: string): KeywordsInfoDto {
    return this.keywordsInMemoryRepository.addKeyword(roomId, questionId, keyword, clientId);
  }

  removeKeyword(roomId: string, questionId: number, keyword: string, clientId: string): KeywordsInfoDto {
    return this.keywordsInMemoryRepository.removeKeyword(roomId, questionId, keyword, clientId);
  }

  getStatistics(roomId: string) {
    return this.keywordsInMemoryRepository.getStatistics(roomId);
  }

  deleteRoomKeywordsInfo(roomId: string) {
    this.keywordsInMemoryRepository.deleteRoomKeywordsInfo(roomId);
  }
}
