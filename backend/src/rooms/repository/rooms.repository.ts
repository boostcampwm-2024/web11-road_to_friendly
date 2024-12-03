import { Phase } from '../../common/definition/phase';

export interface RoomsRepository {
  create(): Promise<string>;
  isExistRoom(roomId: string): Promise<boolean>;
  setHostIfHostUndefined(roomId: string, clientId: string): Promise<string>;
  getHostId(roomId: string): Promise<string>;
  getPhase(roomId: string): Promise<Phase>;
  setPhase(roomId: string, phase: Phase): Promise<boolean>;
  deleteRoom(roomId: string): void;
  updateHost(roomId: string, nextHostId: string): void;
}
