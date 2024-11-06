import { RoomsJoinDto } from './rooms.join.dto';

export class RoomsEnterResponseDto {
  status: string;
  message?: string;
  body?: RoomsJoinDto;
}
