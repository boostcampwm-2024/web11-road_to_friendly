import { ROOM_PHASE } from './phase';

export type Room = {
  roomId: string;
  phase: ROOM_PHASE;
  hostId: string;
}
