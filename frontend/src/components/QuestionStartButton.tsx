import { css } from '@emotion/react';

import { useRadiusStore, useSocketStore } from '@/stores';
import { Variables } from '@/styles';

const ButtonStyle = css({
  backgroundColor: Variables.colors.surface_black,
  color: Variables.colors.text_white,
  font: Variables.typography.font_bold_16,
  borderRadius: '999px',
  padding: '12px 50px'
});

const QuestionStartButton = () => {
  const { socket } = useSocketStore();
  const { setOutOfBounds } = useRadiusStore();

  const onClickStart = () => {
    if (socket) {
      socket.emit('client:host:start');
    }
    setOutOfBounds(true);
  };

  return (
    <button css={ButtonStyle} onClick={onClickStart}>
      관심사로 소통 시작하기 🚀
    </button>
  );
};

export default QuestionStartButton;
