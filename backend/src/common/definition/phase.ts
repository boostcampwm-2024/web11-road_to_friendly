export const PHASE = {
  READY: 'READY',
  KEYWORD: 'KEYWORD',
  STATISTICS: 'STATISTICS',
} as const;

export type Phase = typeof PHASE[keyof typeof PHASE];
