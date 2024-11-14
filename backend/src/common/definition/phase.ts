export const ROOM_PHASE = {
  WAITING: 'WAITING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const;

export type ROOM_PHASE = typeof ROOM_PHASE[keyof typeof ROOM_PHASE];
