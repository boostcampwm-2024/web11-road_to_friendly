export const RESPONSE_STATUS = {
  PICK: 'pick',
  RELEASE: 'release',
} as const;

export type ResponseStatus = typeof RESPONSE_STATUS[keyof typeof RESPONSE_STATUS];

export class KeywordsInfoDto {
  readonly questionId: number;
  readonly keyword: string;
  readonly status: ResponseStatus;
  readonly count: number;

  constructor(questionId: number, keyword: string, status: ResponseStatus, count: number) {
    this.questionId = questionId;
    this.keyword = keyword;
    this.status = status;
    this.count = count;
  }
}
