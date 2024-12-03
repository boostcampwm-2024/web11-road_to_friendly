import { Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';

import { RoomsService } from '../service/rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async createRoom(@Req() request: Request, @Res() response: Response) {
    const roomId = await this.roomsService.create();
    response.redirect(`${request.headers['origin']}/rooms/${roomId}`);
  }
}
