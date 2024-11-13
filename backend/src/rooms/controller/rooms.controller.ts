import { Controller, Post, Res } from '@nestjs/common';
import { RoomsService } from '../service/rooms.service';
import { Response } from 'express';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async createRoom(@Res() response: Response) {
    const roomId = await this.roomsService.create();
    response.redirect(`http://localhost:5173/rooms/${roomId}`);
  }
}
