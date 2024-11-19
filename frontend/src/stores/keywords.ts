import { create } from 'zustand';

import { Keyword, KeywordInfo, Keywords, PrefixSumMap } from '@/types';

interface KeywordsStore {
  keywords: Keywords;
  prefixSumMap: PrefixSumMap;

  upsertKeyword: (targetKeyword: KeywordInfo) => void;
  deleteKeyword: (targetKeyword: { questionId: number; keyword: string }) => void;
}

function getPrefixSumMap(keywords: Keyword[]) {
  const countMap: { [count: number]: number } = {};
  keywords.forEach((value) => (countMap[value.count] = (countMap[value.count] || 0) + 1));

  const sortedCountKeyArray = Object.keys(countMap).sort((a, b) => Number(b) - Number(a));
  return sortedCountKeyArray.reduce(
    (acc: { prefixSum: number; map: { [key: number]: number } }, cur) => {
      const blockSize = countMap[Number(cur)];
      acc.prefixSum += blockSize;
      acc.map[Number(cur)] = acc.prefixSum;
      return acc;
    },
    { prefixSum: 0, map: {} }
  ).map;
}

function appendKeyword(
  keywords: Keywords,
  prefixSumMap: PrefixSumMap,
  newKeywordData: { questionId: number; keyword: string; count: number }
) {
  const { questionId, keyword } = newKeywordData;

  const appendedKeywords = [...(keywords[questionId] || []), { keyword, count: 1 }];
  const curPrefixSumMap = getPrefixSumMap(appendedKeywords);

  return {
    keywords: {
      ...keywords,
      [questionId]: [...(keywords[questionId] || []), { keyword, count: 1 }]
    },
    prefixSumMap: {
      ...prefixSumMap,
      [questionId]: curPrefixSumMap
    }
  };
}

function modifyKeywordCount(
  keywords: Keywords,
  prefixSumMap: PrefixSumMap,
  targetKeyword: { questionId: number; keyword: string; count: number }
) {
  const { questionId, keyword, count } = targetKeyword;

  const modifiedKeywords = keywords[questionId].map((element) =>
    element.keyword === keyword ? { ...element, count: count } : element
  );
  const sortedKeywords = modifiedKeywords.sort((a, b) => b.count - a.count);
  const curPrefixSumMap = getPrefixSumMap(sortedKeywords);

  return {
    keywords: {
      ...keywords,
      [questionId]: sortedKeywords
    },
    prefixSumMap: {
      ...prefixSumMap,
      [questionId]: curPrefixSumMap
    }
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
  prefixSumMap: {},

  upsertKeyword: (targetKeyword) => {
    set((state) => {
      const { questionId, keyword } = targetKeyword;
      if (state.keywords[questionId].some((element) => element.keyword === keyword))
        return modifyKeywordCount(state.keywords, state.prefixSumMap, targetKeyword);
      return appendKeyword(state.keywords, state.prefixSumMap, targetKeyword);
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
