import { Inject, Injectable } from '@nestjs/common';

import { KeywordsRepository } from '../repository/keywords.repository';

@Injectable()
export class KeywordsService {
  constructor(
    @Inject('KEYWORDS_REPOSITORY')
    private readonly keywordsRepository: KeywordsRepository,
  ) {}

  addKeyword(roomId: string, questionId: number, keyword: string, clientId: string) {
    return this.keywordsRepository.addKeyword(roomId, questionId, keyword, clientId);
  }

  removeKeyword(roomId: string, questionId: number, keyword: string, clientId: string) {
    return this.keywordsRepository.removeKeyword(roomId, questionId, keyword, clientId);
  }

  getStatistics(roomId: string) {
    return this.keywordsRepository.getStatistics(roomId);
  }

  deleteRoomKeywordsInfo(roomId: string) {
    this.keywordsRepository.deleteRoomKeywordsInfo(roomId);
  }
}
