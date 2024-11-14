import { css } from '@emotion/react';
import { Variables } from '@/styles/Variables';

const ResultInstructionStyle = css`
  width: 100%;
  font: ${Variables.typography.font_bold_24};
  text-align: center;
`;

const ResultInstruction = () => (
  <div css={ResultInstructionStyle}>우리가 함께 지닌 공감 포인트들</div>
);

export default ResultInstruction;
