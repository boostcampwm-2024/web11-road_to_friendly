import { Keyword } from './keyword';

export interface Participant {
  nickname: string;
  keywords?: Keyword[];
}
