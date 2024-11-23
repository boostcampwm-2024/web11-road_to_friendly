import { Controller, Post, Req, Res } from '@nestjs/common';
import { RoomsService } from '../service/rooms.service';
import { Response } from 'express';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {
  }

  @Post()
  createRoom(@Req() request: Request, @Res() response: Response) {
    const roomId = this.roomsService.create();
    response.redirect(`${ request.headers['origin'] }/rooms/${ roomId }`);
  }
}
