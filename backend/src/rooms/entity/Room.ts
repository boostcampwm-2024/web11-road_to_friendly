import { Socket } from 'socket.io';
import { RoomsJoinDto } from '../dto/rooms.join.dto';
import { RoomsParticipantDto } from '../dto/rooms.participant.dto';


export class Room {
  private participants: Socket[] = [];

  join(client: Socket): RoomsJoinDto {
    this.participants.push(client);

    const nowParticipants: RoomsParticipantDto[] =
      this.participants.map(participant => new RoomsParticipantDto(participant));

    const hostFlag = this.participants[0] === client;

    return { participants: nowParticipants, hostFlag };
  }

  exit(client: Socket) {
    const nowParticipants = this.participants.filter(participant => participant !== client);
    const hasParticipantFlag = Boolean(nowParticipants.length);
    const hostChangeFlag = hasParticipantFlag && this.participants[0] !== nowParticipants[0];
    this.participants = nowParticipants;

    return { hostChangeFlag };
  }

  getHostInfo() {
    const host = this.participants[0];
    return { participantId: host.id, nickname: host.data.nickname };
  }
}
