import { Socket } from 'socket.io';

export class RoomsParticipantDto {
  id: string;
  nickname: string;

  constructor(participant: Socket) {
    this.id = participant.id;
    this.nickname = participant.data.nickname;
  }
}
