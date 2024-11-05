import { Controller, Post, Res } from '@nestjs/common';
import { RoomsService } from '../service/rooms.service';
import { Response } from 'express';

@Controller('rooms')
export class RoomsController {

  constructor(private readonly roomsService: RoomsService) {
  }

  @Post()
  createRoom(@Res() response: Response) {
    const roomId = this.roomsService.create();
    response.redirect(`http://localhost:5173/${ roomId }`);
  }
}
