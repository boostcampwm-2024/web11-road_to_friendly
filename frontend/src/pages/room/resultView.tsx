import { css } from '@emotion/react';
import { Variables, StatisticsStyleMap } from '@/styles';
import { useParticipantsStore, useSocketStore } from '@/stores';
import { useCallback, useEffect, useState } from 'react';
import { Keyword, KeywordInfo, Participant, Group, KeywordResponse } from '@/types';
import { useToast } from '@/hooks';
import { BIG_THRESHOLD, MIDEIUM_THRESHOLD, SMALL_THRESHOLD } from '@/constants';

const KeywordsContainer = css`
  width: 100%;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 8px;
`;

const KeywordStyle = css`
  border: 1px solid black;
  padding: 3px 10px;
  background: ${Variables.colors.surface_word_default};
  border-radius: 50px;
  text-align: center;
  min-width: 90px;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface CommonResult {
  [userId: string]: KeywordInfo[];
}

interface ResultViewProps {
  participant: Participant;
  startResultLoading: () => void;
  finishResultLoading: () => void;
}

const mockData: CommonResult = {
  whxY1RpfoeLNmcjVAAAL: [
    { questionId: 4, keyword: '고양이', count: 4 },
    { questionId: 1, keyword: '짜장면', count: 3 },
    { questionId: 2, keyword: 'java', count: 3 },
    { questionId: 3, keyword: '심규선', count: 1 }
  ],
  nPu8dk1EbcUoAvBhAAAF: [
    { questionId: 4, keyword: '고양이', count: 4 },
    { questionId: 2, keyword: 'java', count: 3 }
  ],
  nPu8dk1EbcUoㄷㄷvBhAAAF: [
    { questionId: 4, keyword: '고양이', count: 4 },
    { questionId: 1, keyword: '짜장면', count: 3 },
    { questionId: 2, keyword: 'java', count: 3 }
  ],
  nPu8dk1EbcUㄴㄷvBhAAAF: [
    { questionId: 4, keyword: '고양이', count: 4 },
    { questionId: 1, keyword: '짜장면', count: 3 }
  ]
};

const ResultView = ({ participant, startResultLoading, finishResultLoading }: ResultViewProps) => {
  const { socket } = useSocketStore();
  const { setParticipants } = useParticipantsStore();
  const { openToast } = useToast();
  const [allKeywords, setAllKeywords] = useState<{ [keyword: string]: number }>({});

  // 전체 키워드의 종류의 개수
  const totalKeywords = Object.keys(allKeywords).length;

  // 비율에 따라 스타일 적용
  const getKeywordStyle = useCallback(
    (keyword: string) => {
      const ratio = Math.ceil((allKeywords[keyword] / totalKeywords) * 100);

      if (ratio < BIG_THRESHOLD) return 'Big';
      if (ratio < MIDEIUM_THRESHOLD) return 'Medium';
      if (ratio < SMALL_THRESHOLD) return 'Small';
      return 'Tiny';
    },
    [allKeywords, totalKeywords]
  );

  useEffect(() => {
    const allKeywordsFlat = Object.values(mockData).flat();

    // 중복 키워드를 제외하고 Map(키워드 : 카운트) 생성
    const keywordCountMap = allKeywordsFlat.reduce((acc: { [keyword: string]: number }, { keyword, count }) => {
      !acc[keyword] && (acc[keyword] = count);
      return acc;
    }, {});

    const sortedKeywords = Object.entries(keywordCountMap).sort((a, b) => b[1] - a[1]);

    // 각 키워드의 랭크 계산 (동순위 처리)
    const sortedRanks = [];
    let currentRank = 1;

    for (let i = 0; i < sortedKeywords.length; i++) {
      const [targetKeyword] = sortedKeywords[i];

      if (i === 0 || sortedKeywords[i][1] !== sortedKeywords[i - 1][1]) {
        currentRank = i + 1;
      }
      sortedRanks.push([targetKeyword, currentRank]);
    }

    setAllKeywords(Object.fromEntries(sortedRanks));
  }, []);

  useEffect(() => {
    console.log('resultview 컴포넌트 렌더링됨');
    startResultLoading();

    if (socket && socket.connected) {
      socket.on('empathy:result', (result) => {
        console.log(result);
        // console.log(Object.keys(response));
        // if (Object.keys(response).length > 0) {
        //   finishResultLoading();
        //   Object.entries(response).forEach(([userId, array]) => {
        //     setParticipants((prev) => ({ ...prev, [userId]: { ...prev[userId], keywords: array } }));
        //   });
        // } else {
        //   openToast({ type: 'error', text: '통계 분석 중 오류가 발생했습니다. 다시 시도해주세요' });
        // }
      });
    }

    return () => {
      socket?.off('empathy:result');
      socket?.off('connect');
    };
  }, [socket]);

  return (
    <ul css={KeywordsContainer}>
      {participant.keywords?.map(({ keyword }, index: number) => (
        <li key={index} css={[KeywordStyle, StatisticsStyleMap()[getKeywordStyle(keyword)]]}>
          {keyword}
        </li>
      ))}
    </ul>
  );
};

export default ResultView;
