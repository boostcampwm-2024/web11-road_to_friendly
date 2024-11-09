import { css } from '@emotion/react';

import { useSocketStore } from '@/stores';
import { Variables } from '@/styles';

const ButtonStyle = css({
  backgroundColor: Variables.colors.surface_black,
  color: Variables.colors.text_white,
  font: Variables.typography.font_bold_24,
  borderRadius: '999px',
  padding: '16px 144px'
});

const QuestionStartButton = () => {
  const { socket } = useSocketStore();

  const onClickStart = () => {
    if (socket) {
      socket.emit('participant:host:start');
    }
  };

  return (
    <button css={ButtonStyle} onClick={onClickStart}>
      추억 모으기 시작하기 🚀
    </button>
  );
};

export default QuestionStartButton;
