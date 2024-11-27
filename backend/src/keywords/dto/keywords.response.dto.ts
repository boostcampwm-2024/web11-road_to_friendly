import { Action, KeywordsInfoDto } from './keywords.info.dto';

export class KeywordsResponseDto {
  readonly status = 'ok';
  readonly questionId: number;
  readonly keyword: string;
  readonly action: Action;

  constructor({ questionId, keyword, action }: KeywordsInfoDto) {
    this.questionId = questionId;
    this.keyword = keyword;
    this.action = action;
  }
}
