import { Module } from '@nestjs/common';
import { KeywordsGateway } from '../gateway/keywords.gateway';
import { KeywordsService } from '../service/keywords.service';
import { KeywordsInMemoryRepository } from '../repository/keywords.in-memory.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [KeywordsGateway, KeywordsService, KeywordsInMemoryRepository],
})
export class KeywordsModule {}
