import { css } from '@emotion/react';
import { useEffect } from 'react';

import { useSocketStore } from '@/stores';
import { useKeywordsStore } from '@/stores/keywords';
import { keywordStyleMap, Variables } from '@/styles';
import { Group, Keyword, PrefixSum } from '@/types';
import { BIG_THRESHOLD, MIDEIUM_THRESHOLD, SMALL_THRESHOLD } from '@/constants';

const KeywordsContainer = css`
  width: 100%;
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const KeywordStyle = css`
  border: 1px solid black;
  height: fit-content;
  padding: 0.5rem 0.75rem;
  background: ${Variables.colors.surface_word_default};
  text-align: center;
  min-width: 60px;
  transition: font-size 0.3s ease;
`;

interface KeywordsViewProps {
  questionId: number;
}

function getKeywordGroup(keyword: Keyword, keywordCountSum: number, prefixSum: PrefixSum): Group {
  const { count } = keyword;
  const curPrefixSum = prefixSum[count];
  const ratio = Math.ceil((curPrefixSum / keywordCountSum) * 100);

  if (ratio < BIG_THRESHOLD) {
    return 'Big';
  } else if (ratio < MIDEIUM_THRESHOLD) {
    return 'Medium';
  } else if (ratio < SMALL_THRESHOLD) {
    return 'Small';
  }
  return 'Tiny';
}

const KeywordsView = ({ questionId }: KeywordsViewProps) => {
  const { socket } = useSocketStore();
  const { keywords, prefixSumMap, upsertKeyword } = useKeywordsStore();

  useEffect(() => {
    if (socket) {
      socket.off('empathy:keyword:count');

      socket.on('empathy:keyword:count', (response: { questionId: number; keyword: string; count: number }) => {
        upsertKeyword(response);
      });
    }

    return () => {
      socket?.off('empathy:keyword:count');
    };
  }, [socket]);

  return (
    <div css={KeywordsContainer}>
      {keywords[questionId]?.map((keywordObject) => (
        <div
          key={`${questionId}-${keywordObject.keyword}`}
          css={[
            KeywordStyle,
            keywordStyleMap(false)[
              getKeywordGroup(keywordObject, keywords[questionId].length, prefixSumMap[questionId])
            ]
          ]}
        >
          {keywordObject.keyword}
        </div>
      ))}
    </div>
  );
};

export default KeywordsView;
