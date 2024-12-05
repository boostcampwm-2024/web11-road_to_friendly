import { Keyword } from './keyword';

export interface Participant {
  index?: number;
  nickname: string;
  keywords?: Keyword[];
}
