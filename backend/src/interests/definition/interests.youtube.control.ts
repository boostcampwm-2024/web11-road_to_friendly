export const INTERESTS_YOUTUBE_CONTROL = {
  PLAY: 'PLAY',
  STOP: 'STOP',
  TIMELINE: 'TIMELINE',
  SPEED: 'SPEED',
  DRAGGING: 'DRAGGING',
} as const;

export type interestsYoutubeControl = typeof INTERESTS_YOUTUBE_CONTROL[keyof typeof INTERESTS_YOUTUBE_CONTROL];
