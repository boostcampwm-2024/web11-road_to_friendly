const RESPONSE_STATUS = {
  PICK: 'pick',
  RELEASE: 'release'
} as const;

type ResponseStatus = (typeof RESPONSE_STATUS)[keyof typeof RESPONSE_STATUS];

export interface KeywordResponse {
  readonly questionId: number;
  readonly keyword: string;
  readonly status: ResponseStatus;
}

export type YoutubeRequestType = 'PLAY' | 'STOP' | 'TIMELINE' | 'SPEED' | 'DRAGGING';

export interface InterestYoutubeResponse {
  requestType: YoutubeRequestType;
  videoCurrentTime: number;
  playStatus: string;
  targetTime: number;
  playSpeed: number;
}
