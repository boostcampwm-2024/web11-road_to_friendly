export const PHASE = {
  READY: 'READY',
  KEYWORD: 'KEYWORD',
  INTEREST: 'INTEREST',
} as const;

export type Phase = typeof PHASE[keyof typeof PHASE];
