import { create } from 'zustand';

import { Keyword } from '@/types';

interface KeywordsStore {
  keywords: {
    [questionId: number]: Keyword[];
  };
  appendKeyword: (newKeywordData: { questionId: number; keyword: string; count: number }) => void;
  deleteKeyword: (targetKeyword: { questionId: number; keyword: string }) => void;
}

export const useKeywordsStore = create<KeywordsStore>((set) => ({
  keywords: {
    1: [
      { keyword: '삼계탕', count: 1 },
      { keyword: '미역국', count: 1 },
      { keyword: '제육볶음', count: 1 },
      { keyword: '떡볶이', count: 2 },
      { keyword: '김치찌개', count: 1 }
    ],
    2: [
      { keyword: '갈비탕', count: 1 },
      { keyword: '찜닭', count: 1 },
      { keyword: '장충동왕족발보쌈', count: 1 },
      { keyword: '닭칼국수다 어쩔래어쩔어쩔', count: 1 },
      { keyword: '불고기', count: 1 },
      { keyword: '비빔밥', count: 1 },
      { keyword: '만두전골', count: 1 }
    ],
    3: [],
    4: [],
    5: []
  },
  appendKeyword: (newKeywordData) =>
    set((state) => {
      const { questionId } = newKeywordData;
      return {
        keywords: {
          ...state.keywords,
          [questionId]: [
            ...(state.keywords[questionId] || []),
            { keyword: newKeywordData.keyword, count: newKeywordData.count }
          ]
        }
      };
    }),
  deleteKeyword: (targetKeyword) =>
    set((state) => {
      const updatedKeywords = state.keywords[targetKeyword.questionId]?.filter((item) => item.keyword !== targetKeyword.keyword);

      return {
        keywords: {
          ...state.keywords,
          [targetKeyword.questionId]: updatedKeywords
        }
      };
    })
}));
