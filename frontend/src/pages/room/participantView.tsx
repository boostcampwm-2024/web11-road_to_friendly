import { css } from '@emotion/react';

import { Variables } from '@/styles/Variables';

const ParticipantView = () => {
  return (
    <div>
      <p css={InstructionStyle}>
        방장이 시작 버튼을 누르지 않았어요.
        <br />
        조금만 더 기다려주세요
      </p>
    </div>
  );
};

export default ParticipantView;

const InstructionStyle = css`
  font: ${Variables.typography.font_bold_20};
  text-align: center;
`;
