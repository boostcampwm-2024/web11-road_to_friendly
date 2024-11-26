import { css } from '@emotion/react';
import { useCallback, useEffect, useState } from 'react';

import { BIG_THRESHOLD, MIDEIUM_THRESHOLD, SMALL_THRESHOLD } from '@/constants';
import { useSocketStore } from '@/stores';
import { useKeywordsStore } from '@/stores/keywords';
import { Variables, StatisticsStyleMap } from '@/styles';
import { Participant } from '@/types';

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
  height: 40px;
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

  // 비율에 따라 스타일 적용
  const getKeywordStyle = useCallback(
    (keyword: string) => {
      const ratio = allKeywords[keyword];

      if (ratio < BIG_THRESHOLD) return 'Big';
      if (ratio < MIDEIUM_THRESHOLD) return 'Medium';
      if (ratio < SMALL_THRESHOLD) return 'Small';
      return 'Tiny';
    },
    [allKeywords]
  );

  useEffect(() => {
    const allKeywordsFlat = Object.values(statisticsKeywords).flat();

    // 중복 키워드를 제외하고 Map(키워드 : 카운트) 생성
    const keywordCountMap = allKeywordsFlat.reduce((acc: { [keyword: string]: number }, { keyword, count }) => {
      !acc[keyword] && (acc[keyword] = count);
      return acc;
    }, {});

    const sortedKeywords = Object.entries(keywordCountMap).sort((a, b) => b[1] - a[1]);
    const totalCount = sortedKeywords.reduce((sum, arr) => sum + arr[1], 0);

    const ratioData = sortedKeywords.reduce((acc: { [keyword: string]: number }, [keyword, count], index) => {
      // 자신과 같거나 더 큰 카운트를 모두 합산
      const sumGreaterOrEqual = sortedKeywords
        .filter(([_, otherCount]) => otherCount >= count)
        .reduce((acc, [_, count]) => acc + count, 0);

      // 상위 비율 계산 (합산된 값이 전체 카운트에서 차지하는 비율)
      const ratio = Math.ceil((sumGreaterOrEqual / totalCount) * 100);

      acc[keyword] = ratio;

      return acc;
    }, {});

    setAllKeywords(ratioData);
  }, []);

  useEffect(() => {
    return () => {
      socket?.off('empathy:result');
    };
  }, [socket]);

  return (
    <ul css={KeywordsContainer}>
      {(participant.keywords ?? []).slice(0, 3).map(({ keyword }, index: number) => (
        <li key={index} css={[KeywordStyle, StatisticsStyleMap()[getKeywordStyle(keyword)]]}>
          {keyword}
        </li>
      ))}
    </ul>
  );
};

export default ResultView;
