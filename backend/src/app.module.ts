import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsGateway } from './rooms/gateway/rooms.gateway';
import { RoomsService } from './rooms/service/rooms.service';
import { RoomsController } from './rooms/controller/rooms.controller';
import { EmpathyGateway } from './empathy/gateway/empathy.gateway';
import { EmpathyService } from './empathy/service/empathy.service';
import { EmpathyInMemoryRepository } from './empathy/repository/empathy.in-memory.repository';

@Module({
  imports: [],
  controllers: [AppController, RoomsController],
  providers: [AppService, RoomsGateway, RoomsService, EmpathyGateway, EmpathyService, EmpathyInMemoryRepository],
})
export class AppModule {
}
