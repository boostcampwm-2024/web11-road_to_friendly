import { css } from '@emotion/react';
import { useEffect } from 'react';

import { useSocketStore } from '@/stores';
import { useKeywordsStore } from '@/stores/keywords';
import { Variables } from '@/styles';

const KeywordsContainer = css`
  width: 100%;
  margin-top: 50px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
`;
const KeywordStyle = css`
  border: 1px solid black;
  padding: 3px 10px;
  background: ${Variables.colors.surface_word_default};
  border-radius: 50px;
  text-align: center;
  min-width: 60px;
`;

interface KeywordsViewProps {
  questionId: number;
}

const KeywordsView = ({ questionId }: KeywordsViewProps) => {
  const { socket } = useSocketStore();
  const { keywords, appendKeyword } = useKeywordsStore();

  useEffect(() => {
    if (socket) {
      socket.on('empathy:keyword:count', (response: { questionId: number; keyword: string; count: number }) => {
        appendKeyword(response);
      });
    }
  }, [socket]);

  return (
    <div css={KeywordsContainer}>
      {keywords[questionId]?.map((keywordObject) => (
        <div key={`${questionId}-${keywordObject.keyword}`} css={KeywordStyle}>
          {keywordObject.keyword}
        </div>
      ))}
    </div>
  );
};

export default KeywordsView;
