export type Group = 'Big' | 'Medium' | 'Small' | 'Tiny';

export interface Keyword {
  keyword: string;
  count: number;
}

export interface KeywordInfo {
  questionId: number;
  keyword: string;
  count: number;
}
