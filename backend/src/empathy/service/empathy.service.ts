import { Injectable } from '@nestjs/common';
import { EmpathyInMemoryRepository } from '../repository/empathy.in-memory.repository';
import { EmpathyKeywordInfoDto } from '../dto/empathy.keyword.info.dto';

@Injectable()
export class EmpathyService {

  constructor(private readonly empathyInMemoryRepository: EmpathyInMemoryRepository) {
  }

  async addKeyword(roomId: string, questionId: number, keyword: string, clientId: string): Promise<EmpathyKeywordInfoDto> {
    return await this.empathyInMemoryRepository.addKeyword(roomId, questionId, keyword, clientId);
  }

  async removeKeyword(roomId: string, questionId: number, keyword: string, clientId: string): Promise<EmpathyKeywordInfoDto> {
    return await this.empathyInMemoryRepository.removeKeyword(roomId, questionId, keyword, clientId);
  }

  getStatistics(roomId: string) {
    return this.empathyInMemoryRepository.calculateStatistics(roomId);
  }
}
