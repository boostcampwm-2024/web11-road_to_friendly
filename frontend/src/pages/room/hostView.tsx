import { Variables } from '../../styles/Variables';
import { css } from '@emotion/react';

const InstructionContainerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${Variables.spacing.spacing_md};
`;

const InstructionStyle = css`
  font: ${Variables.typography.font_bold_24};
  text-align: center;
`;

const StartButtonStyle = css`
  font: ${Variables.typography.font_medium_16};
  color: ${Variables.colors.text_white};
  border-radius: 50px;
  padding: 10px;
  width: 300px;
  text-align: center;
  background: ${Variables.colors.surface_black};
`;

interface HostViewProps {
  participantCount: number;
}

const handleStart = () => {
  //로직 추가
};

const HostView = ({ participantCount }: HostViewProps) => {
  return (
    <div>
      {participantCount > 1 ? (
        <div css={InstructionContainerStyle}>
          <p css={InstructionStyle}>
            방에 참가자들이
            <br /> 다 모였다면 시작해볼까요?
          </p>
          <button onClick={handleStart} css={StartButtonStyle}>
            관심사로 소통하기 시작🚀
          </button>
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
