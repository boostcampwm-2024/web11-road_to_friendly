import { css } from '@emotion/react';

import { useSocketStore } from '@/stores';
import { Variables } from '@/styles';

const QuestionStartButton = () => {
  const { socket } = useSocketStore();

  const onClickStart = () => {
    if (socket) {
      socket.emit('client:host:start');
    }
  };

  return (
    <button css={ButtonStyle} onClick={onClickStart}>
      관심사로 소통 시작하기 🚀
    </button>
  );
};

export default QuestionStartButton;

const ButtonStyle = css({
  backgroundColor: Variables.colors.surface_black,
  color: Variables.colors.text_white,
  font: Variables.typography.font_bold_16,
  borderRadius: '999px',
  padding: '12px 50px'
});
