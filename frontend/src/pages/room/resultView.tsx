import { css } from '@emotion/react';
import { Variables, StatisticsStyleMap } from '@/styles';
import { useSocketStore } from '@/stores';
import { useCallback, useEffect, useState } from 'react';
import { Participant } from '@/types';
import { BIG_THRESHOLD, MIDEIUM_THRESHOLD, SMALL_THRESHOLD } from '@/constants';
import { useKeywordsStore } from '@/stores/keywords';

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

interface ResultViewProps {
  participant: Participant;
}

const ResultView = ({ participant }: ResultViewProps) => {
  const { socket } = useSocketStore();
  const { statisticsKeywords } = useKeywordsStore();
  const [allKeywords, setAllKeywords] = useState<{ [keyword: string]: number }>({});

  // 전체 키워드의 종류의 개수
  const totalKeywords = Object.keys(allKeywords).length;

  // 비율에 따라 스타일 적용
  const getKeywordStyle = useCallback(
    (keyword: string) => {
      const ratio = Math.ceil((allKeywords[keyword] / totalKeywords) * 100);

      // 모든 랭크가 같은지 확인
      const uniqueRanks = new Set(Object.values(allKeywords));

      // 만약 랭크가 하나의 값만 있으면 'Tiny' 반환
      if (uniqueRanks.size === 1) {
        return 'Tiny';
      }

      if (ratio < BIG_THRESHOLD) return 'Big';
      if (ratio < MIDEIUM_THRESHOLD) return 'Medium';
      if (ratio < SMALL_THRESHOLD) return 'Small';
      return 'Tiny';
    },
    [allKeywords, totalKeywords]
  );

  useEffect(() => {
    const allKeywordsFlat = Object.values(statisticsKeywords).flat();

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

    return () => {
      socket?.off('empathy:result');
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
