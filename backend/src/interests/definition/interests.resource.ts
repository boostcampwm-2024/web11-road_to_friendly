export const INTERESTS_RESOURCE = {
  IMAGE: 'IMAGE',
  YOUTUBE: 'YOUTUBE'
} as const;

export type interestsResource = typeof INTERESTS_RESOURCE[keyof typeof INTERESTS_RESOURCE];
