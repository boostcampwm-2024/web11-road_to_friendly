import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsGateway } from './rooms/gateway/rooms.gateway';
import { RoomsService } from './rooms/service/rooms.service';
import { RoomsController } from './rooms/controller/rooms.controller';

@Module({
  imports: [],
  controllers: [AppController, RoomsController],
  providers: [AppService, RoomsGateway, RoomsService],
})
export class AppModule {
}
