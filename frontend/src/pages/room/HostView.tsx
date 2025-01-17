import { css } from '@emotion/react';

import QuestionStartButton from '@/components/QuestionStartButton';

import { flexStyle } from '@/styles';
import { Variables } from '@/styles/variables';

interface HostViewProps {
  participantCount: number;
}

const HostView = ({ participantCount }: HostViewProps) => {
  return (
    <div>
      {participantCount > 1 ? (
        <div css={flexStyle(30, 'column')}>
          <p css={InstructionStyle}>
            방에 참가자들이
            <br /> 다 모였다면 시작해볼까요?
          </p>
          <QuestionStartButton />
        </div>
      ) : (
        <div>
          <p css={InstructionStyle}>
            방이 텅 비었어요.
            <br />
            하단의 버튼을 눌러
            <br />
            친구들을 초대해보세요!
          </p>
        </div>
      )}
    </div>
  );
};

export default HostView;

const InstructionStyle = css`
  font: ${Variables.typography.font_bold_24};
  text-align: center;
`;
