import { KeywordInfo } from './keyword';

export interface CommonResult {
  [userId: string]: KeywordInfo[];
}
