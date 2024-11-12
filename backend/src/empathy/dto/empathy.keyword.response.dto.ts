import { EmpathyKeywordInfoDto, ResponseStatus } from './empathy.keyword.info.dto';

export class EmpathyKeywordResponseDto {
  readonly questionId: number;
  readonly keyword: string;
  readonly status: ResponseStatus;

  constructor({ questionId, keyword, status }: EmpathyKeywordInfoDto) {
    this.questionId = questionId;
    this.keyword = keyword;
    this.status = status;
  }
}
