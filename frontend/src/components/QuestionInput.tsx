import { useToast } from '@/hooks';
import { useSocketStore } from '@/stores';
import { Variables } from '@/styles';
import { KeywordResponse } from '@/types';
import { css } from '@emotion/react';
import { useState } from 'react';

interface QuestionInputProps {
  currentQuestionIndex: number;
}

const inputStyle = css`
  width: 100%;
  height: 30px;
  margin-top: 12px;
  font: ${Variables.typography.font_medium_18};
  color: ${Variables.colors.text_alt};
  text-align: center;
  line-height: 30px;
  border: none;
  border-bottom: 1px solid black;
  outline: none;
  background-color: transparent;
  opacity: 1;
`;

const QuestionInput = ({ currentQuestionIndex }: QuestionInputProps) => {
  const [keyword, setKeyword] = useState('');
  const { openToast } = useToast();
  const { socket } = useSocketStore();

  function handleEnter(e: React.KeyboardEvent) {
    if (e.code !== 'Enter') return;

    if (keyword.length === 0) {
      openToast({ type: 'error', text: '답변이 비어있어요! 입력 후 Enter를 눌러주세요.' });
      return;
    }

    if (socket && socket.connected) {
      socket.emit('keyword:pick', { questionId: currentQuestionIndex + 1, keyword }, (response: KeywordResponse) => {
        console.log(response);
        if (!response) {
          //response.status !== 'pick'
          /*
            TODO: 추후 서버 로직에서 status가 ok로 바뀐다면 수정 필요
            */
          openToast({ text: '서버에서 문제가 생긴 것 같아요. Enter를 눌러 다시 전송해주세요.', type: 'error' });
        } else {
          setKeyword('');
        }
      });
    } else {
      openToast({ text: '연결 상태가 원활하지 않은 것 같아요. Enter를 눌러 다시 전송해주세요.', type: 'error' });
    }
  }

  return (
    <input
      type="text"
      value={keyword}
      placeholder="답변을 입력해주세요"
      css={inputStyle}
      onChange={(e) => setKeyword(e.target.value)}
      onKeyDown={(e) => handleEnter(e)}
    />
  );
};

export default QuestionInput;
