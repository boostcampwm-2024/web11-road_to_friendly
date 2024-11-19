import { useToast } from '@/hooks';
import { sendPickKeywordMessage } from '@/services';
import { useSocketStore } from '@/stores';
import { Variables } from '@/styles';
import { KeywordResponse } from '@/types';
import { css } from '@emotion/react';
import { useState } from 'react';

interface QuestionInputProps {
  currentQuestionIndex: number;
  onSubmit: (keyword: string, type: 'add') => void;
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

const QuestionInput = ({ currentQuestionIndex, onSubmit }: QuestionInputProps) => {
  const [keyword, setKeyword] = useState('');
  const { openToast } = useToast();
  const { socket } = useSocketStore();

  function handleEnter(e: React.KeyboardEvent) {
    if (e.code !== 'Enter') return;

    if (keyword.length === 0) {
      openToast({ type: 'error', text: '답변이 비어있어요! 입력 후 Enter를 눌러주세요.' });
      return;
    }

    if (socket) {
      try {
        sendPickKeywordMessage(socket, currentQuestionIndex + 1, keyword); // 서버에 키워드 추가 요청
        setKeyword('');
        onSubmit(keyword, 'add'); // 내가 선택한 키워드에 추가
      } catch (error) {
        if (error instanceof Error) openToast({ text: error.message, type: 'error' });
      }
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
