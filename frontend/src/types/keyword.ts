export type Group = 'Big' | 'Medium' | 'Small' | 'Tiny';

export interface Keyword {
  keyword: string;
  count: number;
}

export interface Keywords {
  [questionId: number]: Keyword[];
}

export interface PrefixSum {
  [count: number]: number;
}

export interface PrefixSumMap {
  [questionId: number]: PrefixSum;
}

export interface KeywordInfo {
  questionId: number;
  keyword: string;
  count: number;
}
