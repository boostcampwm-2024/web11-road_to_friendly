const ACTION_STATUS = {
  PICK: 'pick',
  RELEASE: 'release'
} as const;

type ActionStatus = (typeof ACTION_STATUS)[keyof typeof ACTION_STATUS];

export interface KeywordResponse {
  readonly questionId: number;
  readonly keyword: string;
  readonly status: 'ok' | 'error';
  readonly action: ActionStatus;
}
export interface WaitingQueueResponse {
  nowQueueSize: number;
}

export interface NextContentResponse {
  participantId: string;
  resourceType: 'IMAGE' | 'YOUTUBE';
  resourceUrl: string;
  nowQueueSize: number;
}

export type YoutubeRequestType = 'PLAY' | 'STOP' | 'TIMELINE' | 'SPEED' | 'DRAGGING';

export interface InterestYoutubeResponse {
  requestType: YoutubeRequestType;
  videoCurrentTime: number;
  playStatus: string;
  targetTime: number;
  playSpeed: number;
}
