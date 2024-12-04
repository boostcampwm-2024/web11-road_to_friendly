import { css } from '@emotion/react';
import { useState } from 'react';

import { useToast } from '@/hooks';
import { sendPickKeywordMessage, sendReleaseKeywordMessage } from '@/services';
import { useSocketStore } from '@/stores';
import { Variables } from '@/styles';

interface QuestionInputProps {
  currentQuestionIndex: number;
  selectedKeywords: Set<string>;
  onSubmit: (keyword: string, type: 'add' | 'delete') => void;
}

const QuestionInput = ({ currentQuestionIndex, selectedKeywords, onSubmit }: QuestionInputProps) => {
  const [keyword, setKeyword] = useState('');
  const { openToast } = useToast();
  const { socket } = useSocketStore();
  const MAX_LENGTH = 15;

  async function handleEnter(e: React.KeyboardEvent) {
    if (e.code !== 'Enter') return;

    if (keyword.length === 0) {
      openToast({ type: 'error', text: '답변이 비어있어요! 입력 후 Enter를 눌러주세요.' });
      return;
    }

    if (socket) {
      try {
        if (!selectedKeywords.has(keyword)) {
          await sendPickKeywordMessage(socket, currentQuestionIndex + 1, keyword); // 서버에 키워드 추가 요청
          openToast({ text: '답변을 제출했어요!', type: 'check' });
          setKeyword('');
          onSubmit(keyword, 'add'); // 내가 선택한 키워드에 추가
        } else {
          await sendReleaseKeywordMessage(socket, currentQuestionIndex + 1, keyword); // 서버에 키워드 공감 취소 요청
          openToast({ text: '해당 키워드에 대해 공감을 취소했어요', type: 'check' });
          setKeyword('');
          onSubmit(keyword, 'delete');
        }
      } catch (error) {
        if (error instanceof Error) openToast({ text: error.message, type: 'error' });
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // 입력 길이가 최대 길이를 초과하면 자름
    if (value.length > MAX_LENGTH) {
      setKeyword(value.slice(0, MAX_LENGTH));
    } else {
      setKeyword(value);
    }
  };

  return (
    <div css={wrapperStyle}>
      <input
        type="text"
        value={keyword}
        placeholder="답변을 입력해주세요"
        css={inputStyle}
        maxLength={MAX_LENGTH}
        onChange={handleInputChange}
        onKeyDown={(e) => handleEnter(e)}
      />
      <span css={spanStyle}>{keyword.length}/15</span>
    </div>
  );
};

export default QuestionInput;

const wrapperStyle = css`
  position: relative;
  width: 100%;
  margin-top: ${Variables.spacing.spacing_sm};
`;

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

const spanStyle = css`
  position: absolute;
  right: 10px;
  bottom: 5px;
  font-size: 12px;
  color: ${Variables.colors.text_alt};
`;
