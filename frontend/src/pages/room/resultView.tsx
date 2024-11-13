import { css } from '@emotion/react';
import { Variables } from '@/styles';
import { useParticipantsStore, useSocketStore } from '@/stores';
import { useEffect } from 'react';
import { Keyword, Participant } from '@/types';
import { useToast } from '@/hooks';

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
`;

interface CommonResult {
  status: string;
  body: {
    [userId: string]: Keyword[];
  };
}

interface ResultViewProps {
  participant: Participant;
  setIsResultView: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResultView = ({ participant, setIsResultView }: ResultViewProps) => {
  // const { socket } = useSocketStore();
  // const { setParticipants } = useParticipantsStore();
  // const { openToast } = useToast();

  // useEffect(() => {
  //   if (socket) {
  //     socket.on('empathy:keyword:result', (response: CommonResult) => {
  //       setIsResultView(response.status === 'ok');
  //       if (response.status === 'ok') {
  //         Object.entries(response.body).forEach(([userId, array]) => {
  //           setParticipants((prev) => ({ ...prev, [userId]: { ...prev[userId], keywords: array } }));
  //         });
  //       } else {
  //         openToast({ type: 'error', text: '통계 분석 중 오류가 발생했습니다. 다시 시도해주세요' });
  //       }
  //     });
  //   }

  //   return () => {
  //     socket?.disconnect();
  //   };
  // }, [socket]);

  return (
    <ul css={KeywordsContainer}>
      {/*participant.keywords?.로 수정필요*/}
      {[
        { questionId: 4, keyword: '고양이', count: 5 },
        { questionId: 1, keyword: '짜장면', count: 3 },
        { questionId: 2, keyword: 'java', count: 2 },
        { questionId: 3, keyword: '심규선', count: 1 }
      ]?.map((obj: Keyword, index: number) => (
        <li key={index} css={KeywordStyle}>
          {obj.keyword}
        </li>
      ))}
    </ul>
  );
};

export default ResultView;
