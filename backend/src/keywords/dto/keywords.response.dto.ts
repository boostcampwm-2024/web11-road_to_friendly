import { KeywordsInfoDto, ResponseStatus } from './keywords.info.dto';

export class KeywordsResponseDto {
  readonly questionId: number;
  readonly keyword: string;
  readonly status: ResponseStatus;

  constructor({ questionId, keyword, status }: KeywordsInfoDto) {
    this.questionId = questionId;
    this.keyword = keyword;
    this.status = status;
  }
}
