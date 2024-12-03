import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import { Variables } from '@/styles';
import { TextSeparate } from '../common';

interface RoomErrorProps {
  title: string;
  description: string;
  AnimationElement?: JSX.Element;
}

const RoomError = ({ title, description, AnimationElement }: RoomErrorProps) => {
  const navigate = useNavigate();
  return (
    <div css={backgroundStyle}>
      {AnimationElement && AnimationElement}
      <h1>{title}</h1>
      <TextSeparate text={description} />
      <button css={backToHomeButton} onClick={() => navigate('/')}>
        홈으로 돌아가기
      </button>
    </div>
  );
};

const backgroundStyle = css`
  background: ${Variables.colors.surface_default};
  height: 100vh;
  width: 100vw;
  display: flex;
  gap: ${Variables.spacing.spacing_sm};
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const backToHomeButton = css`
  margin-top: ${Variables.spacing.spacing_sm};
  background: ${Variables.colors.surface_white};
  padding: ${Variables.spacing.spacing_sm};
  white-space: nowrap;
  border-radius: 8px;
  height: 40px;
  width: 120px;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2);
`;

export default RoomError;
