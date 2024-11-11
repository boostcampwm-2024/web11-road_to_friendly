import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CheckIcon from '@/assets/icons/check.svg?react';
import { config } from '@/config';
import { hoverGrowJumpAnimation, Variables } from '@/styles';

import { LoadingSpinner, Toast } from './common';

const startButtonStyle = css(
  {
    font: Variables.typography.font_bold_20,
    color: Variables.colors.text_white,
    backgroundColor: Variables.colors.surface_point,
    borderRadius: 999,
    minWidth: '23.6rem',
    minHeight: '3.5rem',
    ':hover': {
      opacity: 0.8
    }
  },
  hoverGrowJumpAnimation()
);

const RoomCreateButton = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const navigate = useNavigate();

  const createRoom = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.SOCKET_SERVER_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        const roomUrl = new URL(response.url);
        if (roomUrl) navigate(roomUrl.pathname);
      } else {
        console.error('Failed to create room');
        setToast(true);
      }
    } catch (error) {
      console.error('Error creating room:', error);
      setToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {toast && (
        <Toast
          icon={() => <CheckIcon css={{ fill: Variables.colors.text_word_weak }} />}
          text="서버와 통신 중 에러가 발생했습니다!"
          setToast={setToast}
        />
      )}
      <button onClick={createRoom} css={startButtonStyle}>
        {loading ? (
          <div css={{ display: 'flex', justifyContent: 'center' }}>
            <LoadingSpinner
              roundSize="1.7rem"
              emptyColor={`${Variables.colors.surface_white}50`}
              fillColor={Variables.colors.surface_white}
            />
          </div>
        ) : (
          '공감 포인트 나누기 시작하기'
        )}
      </button>
    </div>
  );
};

export default RoomCreateButton;
