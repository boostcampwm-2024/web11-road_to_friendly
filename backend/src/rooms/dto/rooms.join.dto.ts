import { RoomsParticipantDto } from './rooms.participant.dto';

export class RoomsJoinDto {
  participants: RoomsParticipantDto[];
  hostId: string;
}
