import { useNavigate } from 'react-router-dom';
import { Variables } from '../styles/Variables';
import { css } from '@emotion/react';

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

const RoomNotFoundError = () => {
  const navigate = useNavigate();
  return (
    <div css={backgroundStyle}>
      <h1>방 찾을 수 없음</h1>
      <p>죄송합니다. 요청하신 방은 존재하지 않습니다.</p>
      <p>입력한 방 번호가 정확한지 확인해 주시고, 다시 시도해 주세요.</p>
      <button css={backToHomeButton} onClick={() => navigate('/')}>
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default RoomNotFoundError;
