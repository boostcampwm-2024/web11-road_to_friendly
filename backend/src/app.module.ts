import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/module/clients.module';
import { RoomsModule } from './rooms/module/rooms.module';
import { KeywordsModule } from './keywords/module/keywords.module';

@Module({
  imports: [ClientsModule, RoomsModule, KeywordsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
