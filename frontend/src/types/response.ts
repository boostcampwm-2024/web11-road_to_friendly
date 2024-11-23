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
