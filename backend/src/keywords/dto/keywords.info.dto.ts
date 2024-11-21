export const ACTION = {
  PICK: 'pick',
  RELEASE: 'release',
} as const;

export type Action = typeof ACTION[keyof typeof ACTION];

export class KeywordsInfoDto {
  readonly questionId: number;
  readonly keyword: string;
  readonly action: Action;
  readonly count: number;

  constructor(questionId: number, keyword: string, action: Action, count: number) {
    this.questionId = questionId;
    this.keyword = keyword;
    this.action = action;
    this.count = count;
  }
}
