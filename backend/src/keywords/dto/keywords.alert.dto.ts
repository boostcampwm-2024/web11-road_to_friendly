import { KeywordsInfoDto } from './keywords.info.dto';

export class KeywordsAlertDto {
  readonly questionId: number;
  readonly keyword: string;
  readonly count: number;

  constructor(questionId: number, keyword: string, count: number) {
    this.questionId = questionId;
    this.keyword = keyword;
    this.count = count;
  }

  static of(keywordsInfoDto: KeywordsInfoDto) {
    return new this(keywordsInfoDto.questionId, keywordsInfoDto.keyword, keywordsInfoDto.count);
  }
}
