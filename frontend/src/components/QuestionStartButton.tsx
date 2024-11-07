import { css } from '@emotion/react';
import { Variables } from '../styles/Variables';

const ButtonStyle = css({
  backgroundColor: Variables.colors.surface_black,
  color: Variables.colors.text_white,
  font: Variables.typography.font_bold_24,
  borderRadius: '999px',
  padding: '16px 144px'
});

const QuestionStartButton = () => {
  return <button css={ButtonStyle}>추억 모으기 시작하기 🚀</button>;
};

export default QuestionStartButton;
