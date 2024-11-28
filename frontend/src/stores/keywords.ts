import { create } from 'zustand';

import { Keyword, KeywordInfo, Keywords, PrefixSumMap, CommonResult } from '@/types';

const MAX_KEYWORDS_NUM = 30;

interface KeywordsStore {
  keywords: Keywords;
  prefixSumMap: PrefixSumMap;
  statisticsKeywords: CommonResult;

  upsertKeyword: (targetKeyword: KeywordInfo) => void;
  upsertMultipleKeywords: (questionId: number, newKeywords: Keyword[]) => void;
  deleteKeyword: (targetKeyword: { questionId: number; keyword: string }) => void;
  setStatisticsKeywords: (newStatisticsKeywords: CommonResult) => void;
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
  statisticsKeywords: {},

  upsertKeyword: (targetKeyword) => {
    set((state) => {
      const { questionId, keyword } = targetKeyword;
      if (state.keywords[questionId].some((element) => element.keyword === keyword))
        return modifyKeywordCount(state.keywords, state.prefixSumMap, targetKeyword);
      return appendKeyword(state.keywords, state.prefixSumMap, targetKeyword);
    });
  },

  upsertMultipleKeywords: (questionId, newKeywords) => {
    set((state) => {
      const existingKeywords = state.keywords[questionId] || [];

      // 병합 및 count 업데이트
      // newKeywords에 포함된 키워드들은 count를 새로 덮어쓰고, 기존 키워드들은 count를 그대로 유지
      const keywordMap = new Map<string, { count: number; prev: 0 | 1 }>();

      // 기존 키워드들은 count를 그대로 유지
      existingKeywords.forEach(({ keyword, count }) => {
        keywordMap.set(keyword, { count, prev: 1 });
      });

      // 새로운 키워드들은 count를 덮어쓰거나 추가
      newKeywords.forEach(({ keyword, count }) => {
        keywordMap.set(keyword, { count, prev: 0 });
      });

      // 병합 결과를 배열로 변환 후 정렬
      const mergedKeywords = Array.from(keywordMap.entries())
        .map(([keyword, { count, prev }]) => ({ keyword, count, prev }))
        .filter(({ count }) => count > 0) // count가 0 이상인 것만
        .sort((a, b) => {
          if (b.count === a.count) {
            // count가 같은 경우 prev 기준 오름차순 (새로 추가된 키워드 우선)
            return a.prev - b.prev;
          }
          // 기본은 count 기준 내림차순
          return b.count - a.count;
        })
        .slice(0, MAX_KEYWORDS_NUM);

      // 새 PrefixSumMap 계산
      const updatedPrefixSumMap = {
        ...state.prefixSumMap,
        [questionId]: getPrefixSumMap(mergedKeywords)
      };

      return {
        keywords: {
          ...state.keywords,
          [questionId]: mergedKeywords
        },
        prefixSumMap: updatedPrefixSumMap
      };
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
    }),

  setStatisticsKeywords: (newStatisticsKeywords) =>
    set(() => ({
      statisticsKeywords: newStatisticsKeywords
    }))
}));
