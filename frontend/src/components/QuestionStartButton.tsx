import { css } from '@emotion/react';

import { useSocketStore } from '@/stores';
import { Variables } from '@/styles';

const ButtonStyle = css({
  backgroundColor: Variables.colors.surface_black,
  color: Variables.colors.text_white,
  font: Variables.typography.font_bold_20,
  borderRadius: '999px',
  padding: '16px 80px'
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
      관심사로 소통 시작하기 🚀
    </button>
  );
};

export default QuestionStartButton;
