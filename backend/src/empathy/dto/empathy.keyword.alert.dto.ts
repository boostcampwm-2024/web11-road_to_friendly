import { EmpathyKeywordInfoDto } from './empathy.keyword.info.dto';

export class EmpathyKeywordAlertDto {
  readonly questionId: number;
  readonly keyword: string;
  readonly count: number;

  constructor(questionId: number, keyword: string, count: number) {
    this.questionId = questionId;
    this.keyword = keyword;
    this.count = count;
  }

  static ofEmpathyKeywordInfo(empathyKeywordInfo: EmpathyKeywordInfoDto) {
    return new this(empathyKeywordInfo.questionId, empathyKeywordInfo.keyword, empathyKeywordInfo.count);
  }
}
