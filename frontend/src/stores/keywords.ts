import { create } from 'zustand';

import { Keyword, KeywordInfo } from '@/types';

interface KeywordMapElement {
  [keyword: string]: { count: number; index: number };
}

interface KeywordsMap {
  [questionId: number]: KeywordMapElement;
}

interface Keywords {
  [questionId: number]: Keyword[];
}

interface Count {
  [count: number]: number;
}

interface Counts {
  [questionId: number]: number[];
}

interface CountMap {
  [questionId: number]: Count;
}

interface KeywordsStore {
  keywords: Keywords;
  keywordsMap: KeywordsMap;
  counts: Counts;
  countMap: CountMap;
  upsertKeyword: (targetKeyword: KeywordInfo) => void;
  deleteKeyword: (targetKeyword: { questionId: number; keyword: string }) => void;
}

function appendArrayUnique<T>(array: T[], element: T): T[] {
  if (!array.includes(element)) return [...array, element];
  return array;
}

function syncCountMap(array: number[], countMap: Count, element: number): Count {
  if (!array.includes(element)) {
    return { ...countMap, [element]: 1 };
  }
  return countMap;
}

function appendKeyword(
  keywordsMap: KeywordsMap,
  keywords: Keywords,
  counts: Counts,
  countMap: CountMap,
  newKeywordData: { questionId: number; keyword: string; count: number }
) {
  const { questionId, keyword } = newKeywordData;
  const prevLength = keywords[questionId]?.length ?? 0;
  return {
    keywords: {
      ...keywords,
      [questionId]: [...(keywords[questionId] || []), { keyword, count: 1 }]
    },
    counts: { ...counts, [questionId]: appendArrayUnique(counts[questionId] || [], 1) },
    countMap: { ...countMap, [questionId]: syncCountMap(counts[questionId] || [], countMap[questionId] || {}, 1) },
    keywordsMap: {
      ...keywordsMap,
      [questionId]: {
        ...(keywordsMap[questionId] || {}),
        [keyword]: { count: 1, index: prevLength }
      }
    }
  };
}

function modifyKeywordCount(
  keywordsMap: KeywordsMap,
  keywords: Keywords,
  counts: Counts,
  countMap: CountMap,
  targetKeyword: { questionId: number; keyword: string; count: number }
) {
  const { questionId, keyword, count } = targetKeyword;
  const modifiedKeywordsMapElement = {
    ...(keywordsMap[questionId] || {}),
    [keyword]: { count, index: 0 }
  };

  const modifiedKeywordsElement = [...keywords[questionId]].sort(
    (a, b) => modifiedKeywordsMapElement[b.keyword].count - modifiedKeywordsMapElement[a.keyword].count
  );

  modifiedKeywordsElement.forEach((keyword, index) => {
    const key = keyword.keyword;
    modifiedKeywordsMapElement[key].index = index;
  });

  return {
    keywords: {
      ...keywords,
      [questionId]: modifiedKeywordsElement
    },
    counts: { ...counts, [questionId]: appendArrayUnique(counts[questionId] || [], count).sort((a, b) => b - a) },
    countMap: { ...countMap, [questionId]: syncCountMap(counts[questionId] || [], countMap[questionId] || {}, count) },
    keywordsMap: {
      ...keywordsMap,
      [questionId]: modifiedKeywordsMapElement
    }
  };
}

export const useKeywordsStore = create<KeywordsStore>((set) => ({
  keywords: {
    1: [
      { keyword: '김치찌개', count: 1 },
      { keyword: '떡볶이', count: 1 },
      { keyword: '제육볶음', count: 1 },
      { keyword: '미역국', count: 1 },
      { keyword: '삼계탕', count: 1 }
    ],
    2: [
      { keyword: '만두전골', count: 1 },
      { keyword: '비빔밥', count: 1 },
      { keyword: '불고기', count: 1 },
      { keyword: '닭칼국수다 어쩔래어쩔어쩔', count: 1 },
      { keyword: '장충동왕족발보쌈', count: 1 },
      { keyword: '찜닭', count: 1 },
      { keyword: '갈비탕', count: 1 }
    ],
    3: [],
    4: [],
    5: []
  },
  counts: { 1: [1] },
  countMap: { 1: { 1: 5 } },
  keywordsMap: {
    1: {
      김치찌개: { count: 5, index: 0 },
      떡볶이: { count: 4, index: 1 },
      제육볶음: { count: 3, index: 2 },
      미역국: { count: 2, index: 3 },
      삼계탕: { count: 1, index: 4 }
    },
    2: {
      만두전골: { count: 7, index: 0 },
      비빔밥: { count: 6, index: 1 },
      불고기: { count: 5, index: 2 },
      '닭칼국수다 어쩔래어쩔어쩔': { count: 4, index: 3 },
      장충동왕족발보쌈: { count: 3, index: 4 },
      찜닭: { count: 2, index: 5 },
      갈비탕: { count: 1, index: 6 }
    },
    3: {},
    4: {},
    5: {}
  },

  upsertKeyword: (targetKeyword) => {
    set((state) => {
      const { questionId, keyword } = targetKeyword;
      if (state.keywordsMap[questionId] && state.keywordsMap[questionId][keyword])
        return modifyKeywordCount(state.keywordsMap, state.keywords, state.counts, state.countMap, targetKeyword);
      return appendKeyword(state.keywordsMap, state.keywords, state.counts, state.countMap, targetKeyword);
    });
  },

  deleteKeyword: (targetKeyword) =>
    set((state) => {
      const updatedKeywords = state.keywords[targetKeyword.questionId]?.filter(
        (item) => item.keyword !== targetKeyword.keyword
      );

      return {
        keywords: {
          ...state.keywords,
          [targetKeyword.questionId]: updatedKeywords || []
        }
      };
    })
}));
