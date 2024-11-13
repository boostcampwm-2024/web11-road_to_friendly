import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsGateway } from './rooms/gateway/rooms.gateway';
import { RoomsService } from './rooms/service/rooms.service';
import { RoomsController } from './rooms/controller/rooms.controller';
import { KeywordsGateway } from './keywords/gateway/keywords.gateway';
import { KeywordsService } from './keywords/service/keywords.service';
import { KeywordsInMemoryRepository } from './keywords/repository/keywords.in-memory.repository';

@Module({
  imports: [],
  controllers: [AppController, RoomsController],
  providers: [AppService, RoomsGateway, RoomsService, KeywordsGateway, KeywordsService, KeywordsInMemoryRepository],
})
export class AppModule {
}
