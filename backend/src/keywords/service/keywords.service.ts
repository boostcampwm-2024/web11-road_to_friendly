import { Injectable } from '@nestjs/common';
import { KeywordsInMemoryRepository } from '../repository/keywords.in-memory.repository';
import { KeywordsInfoDto } from '../dto/keywords.info.dto';

@Injectable()
export class KeywordsService {

  constructor(private readonly keywordsInMemoryRepository: KeywordsInMemoryRepository) {
  }

  async addKeyword(roomId: string, questionId: number, keyword: string, clientId: string): Promise<KeywordsInfoDto> {
    return await this.keywordsInMemoryRepository.addKeyword(roomId, questionId, keyword, clientId);
  }

  async removeKeyword(roomId: string, questionId: number, keyword: string, clientId: string): Promise<KeywordsInfoDto> {
    return await this.keywordsInMemoryRepository.removeKeyword(roomId, questionId, keyword, clientId);
  }

  getStatistics(roomId: string) {
    return this.keywordsInMemoryRepository.getStatistics(roomId);
  }
}
