import { css } from '@emotion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import Edit from '@/assets/icons/edit.svg?react';
import Profile from '@/assets/icons/profile.svg?react';
import { useParticipantsStore, useSocketStore } from '@/stores';
import { flexStyle, Variables } from '@/styles';

import Modal from './common/Modal';

const profileImageStyle = css`
  width: 40px;
  height: 100%;
  border-radius: 50%;
  cursor: pointer;
`;

const inputStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font: ${Variables.typography.font_medium_16};
  text-align: start;
  border-radius: 8px;
  border: 1px solid ${Variables.colors.surface_alt};
  padding: 5px;
  width: 130px;
`;

const editButtonStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
`;

const saveButtonStyle = css`
  border: none;
  border-radius: 8px;
  padding: 4px 5px;
  color: white;
  white-space: nowrap;
  background-color: ${Variables.colors.surface_strong};
`;

const nicknameContainerStyle = css`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const profileEditContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 250px;
  height: 200px;
  padding-top: 10px;
`;

const wrapperStyle = css`
  position: relative;
  width: 100%;
`;

const spanStyle = css`
  position: absolute;
  right: 10px;
  bottom: 8px;
  font-size: 12px;
  color: ${Variables.colors.text_alt};
`;

const ProfileEditButton = () => {
  const { socket, connect } = useSocketStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const { participants, setParticipants } = useParticipantsStore();
  const nickNameInputRef = useRef<HTMLInputElement>(null);
  const MAX_LENGTH = 6;

  const handleSaveNickname = () => {
    const participantId = socket?.id || '';
    if (participantId !== '' && nicknameInput !== '') {
      socket.emit('client:update', { nickname: nicknameInput });
    }
  };

  const handleProfileUpdate = useCallback(
    (newProfile: { participantId: string; nickname: string }) => {
      setParticipants((prev) => ({
        ...prev,
        [newProfile.participantId]: {
          ...prev[newProfile.participantId],
          nickname: newProfile.nickname
        }
      }));
      setIsEditing(false);
    },
    [setParticipants]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // 입력 길이가 최대 길이를 초과하면 자름
    if (value.length > MAX_LENGTH) {
      setNicknameInput(value.slice(0, MAX_LENGTH));
    } else {
      setNicknameInput(value);
    }
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveNickname();
    }
  };

  useEffect(() => {
    if (!socket) {
      connect();
    }

    if (socket) {
      socket.on('participant:info:update', handleProfileUpdate);

      return () => {
        socket.off('participant:info:update', handleProfileUpdate);
      };
    }
  }, [socket, connect, handleProfileUpdate]);

  useEffect(() => {
    if (isEditing && nickNameInputRef.current) {
      setNicknameInput('');
      nickNameInputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div>
      <button css={profileImageStyle} onClick={() => setIsModalOpen(true)}>
        <Profile width={'100%'} height={'100%'} />
      </button>
      <Modal
        position="topRight"
        closeButton={true}
        isOpen={isModalOpen}
        onClose={() => {
          setIsEditing(false);
          setIsModalOpen(false);
        }}
      >
        <div css={profileEditContainerStyle}>
          <h3>내 프로필</h3>
          <div css={{ position: 'relative', width: '100px', height: '100px' }}>
            <Profile width={'100%'} height={'100%'} />
          </div>
          <div css={flexStyle(10)}>
            <span style={{ font: Variables.typography.font_medium_14 }}>닉네임</span>
            {isEditing ? (
              <div css={nicknameContainerStyle}>
                <div css={wrapperStyle}>
                  <input
                    css={inputStyle}
                    value={nicknameInput}
                    maxLength={MAX_LENGTH}
                    onChange={handleInputChange}
                    onKeyDown={handleEnterKeyDown}
                    placeholder="새 닉네임"
                    ref={nickNameInputRef}
                  />
                  <span css={spanStyle}>{nicknameInput.length}/6</span>
                </div>
                <button css={saveButtonStyle} onClick={handleSaveNickname}>
                  저장
                </button>
              </div>
            ) : (
              <div css={nicknameContainerStyle}>
                <div css={inputStyle}>
                  {!isEditing && (
                    <>
                      <span>{participants[socket?.id || '']?.nickname || '알 수 없음'}</span>
                      <button css={editButtonStyle} onClick={() => setIsEditing(true)}>
                        <Edit width={'22px'} height={'22px'} fill={'#ff5b5b'} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileEditButton;
