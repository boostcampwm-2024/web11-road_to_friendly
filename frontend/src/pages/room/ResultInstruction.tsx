import { css, keyframes } from '@emotion/react';

import { Variables } from '@/styles/variables';

interface ResultInstructionProps {
  isFadingOut: boolean;
}

const ResultInstruction = ({ isFadingOut }: ResultInstructionProps) => (
  <div css={ResultInstructionStyle(isFadingOut)}>우리가 함께 지닌 공감 포인트들</div>
);

export default ResultInstruction;

// 페이드아웃 애니메이션 정의
const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const ResultInstructionStyle = (isFadingOut: boolean) => css`
  width: 100%;
  font: ${Variables.typography.font_bold_24};
  text-align: center;
  opacity: ${isFadingOut ? 0 : 1};
  animation: ${isFadingOut ? fadeOut : 'none'} 1s forwards; // 1초 동안 페이드아웃
  transition: opacity 0.5s ease-in-out;
`;
