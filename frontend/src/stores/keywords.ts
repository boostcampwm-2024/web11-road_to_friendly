import { create } from 'zustand';

import { Keyword, KeywordInfo } from '@/types';

interface Keywords {
  [questionId: number]: Keyword[];
}

interface Count {
  [count: number]: number;
}

interface CountMap {
  [questionId: number]: Count;
}

interface KeywordsStore {
  keywords: Keywords;
  countMap: CountMap;

  upsertKeyword: (targetKeyword: KeywordInfo) => void;
  deleteKeyword: (targetKeyword: { questionId: number; keyword: string }) => void;
}

function syncCountMap(countMap: Count, count: number): Count {
  if (!Object.keys(countMap).includes(count.toString())) {
    return { ...countMap, [count]: 1 };
  }
  return countMap;
}

function appendKeyword(
  keywords: Keywords,
  countMap: CountMap,
  newKeywordData: { questionId: number; keyword: string; count: number }
) {
  const { questionId, keyword } = newKeywordData;
  return {
    keywords: {
      ...keywords,
      [questionId]: [...(keywords[questionId] || []), { keyword, count: 1 }]
    },
    countMap: { ...countMap, [questionId]: syncCountMap(countMap[questionId] || {}, 1) }
  };
}

function modifyKeywordCount(
  keywords: Keywords,
  countMap: CountMap,
  targetKeyword: { questionId: number; keyword: string; count: number }
) {
  const { questionId, keyword, count } = targetKeyword;

  const modifiedKeywords = keywords[questionId].map((element) =>
    element.keyword === keyword ? { ...element, count: count } : element
  );
  const sortedKeywords = modifiedKeywords.sort((a, b) => b.count - a.count);

  return {
    keywords: {
      ...keywords,
      [questionId]: sortedKeywords
    },
    countMap: { ...countMap, [questionId]: syncCountMap(countMap[questionId] || {}, count) }
  };
}

export const useKeywordsStore = create<KeywordsStore>((set) => ({
  keywords: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  },
  countMap: {},

  upsertKeyword: (targetKeyword) => {
    set((state) => {
      const { questionId, keyword } = targetKeyword;
      if (state.keywords[questionId].some((element) => element.keyword === keyword))
        return modifyKeywordCount(state.keywords, state.countMap, targetKeyword);
      return appendKeyword(state.keywords, state.countMap, targetKeyword);
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
