import { hoverGrowJumpAnimation } from '../styles';
import { useNavigate } from 'react-router-dom';
import { Variables } from '../styles/Variables';
import { css } from '@emotion/react';
import { useState } from 'react';
import { LoadingSpinner, Toast } from './common';
import CheckIcon from '../assets/icons/check.svg?react';

const startButtonStyle = css(
  {
    font: Variables.typography.font_bold_24,
    color: Variables.colors.text_white,
    backgroundColor: Variables.colors.surface_point,
    padding: '24px 48px',
    borderRadius: 32,
    minWidth: '23.6rem',
    minHeight: '5.1875rem',
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
      const response = await fetch('http://localhost:8080/rooms', {
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
