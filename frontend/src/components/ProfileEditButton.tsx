import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

import Modal from './common/Modal';
import { useParticipantsStore, useSocketStore } from '@/stores';

import Profile from '@/assets/icons/profile.svg?react';
import Edit from '@/assets/icons/edit.svg?react';
import { flexStyle, Variables } from '@/styles';

const profileImageStyle = css`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
`;

const inputStyle = css`
  font: ${Variables.typography.font_medium_16};
  text-align: start;
  border-radius: 8px;
  border: 1px solid ${Variables.colors.surface_alt};
  padding: 5px;
  width: 150px;
`;

const editButtonStyle = css`
  position: absolute;
  width: 27px;
  height: 27px;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 5px;
  bottom: 5px;
  border: none;
  border-radius: 50%;
  background-color: ${Variables.colors.surface_black};
  cursor: pointer;
`;

const saveButtonStyle = css`
  border: none;
  border-radius: 8px;
  padding: 4px 5px;
  color: white;
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
`;

const ProfileEditButton = () => {
  const { socket, connect, disconnect } = useSocketStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const { participants, setParticipants } = useParticipantsStore();

  const handleProfileUpdate = (newProfile: { participantId: string; nickname: string }) => {
    setParticipants((prev) => ({
      ...prev,
      [newProfile.participantId]: {
        ...prev[newProfile.participantId],
        nickname: newProfile.nickname
      }
    }));
  };

  const handleSaveNickname = () => {
    const participantId = socket?.id || '';
    if (participantId && nicknameInput) {
      handleProfileUpdate({ participantId, nickname: nicknameInput });
    }
    setIsEditing(false);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!socket) connect();

    if (socket) {
      const currentUserId = socket?.id || '';
      const currentNickname = participants[currentUserId]?.nickname || '알 수 없음';

      // 사용자 정보 요청 및 프로필 업데이트 이벤트 설정
      socket.emit('join', { nickname: currentNickname });
      socket.on('participant:info:update', handleProfileUpdate);

      return () => {
        socket.off('participant:info:update', handleProfileUpdate);
        disconnect();
      };
    }
  }, [socket, setParticipants]);

  return (
    <div>
      <button css={profileImageStyle} onClick={() => setIsModalOpen(true)}>
        <Profile width={'100%'} height={'100%'} />
      </button>
      <Modal
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
            {!isEditing && (
              <button css={editButtonStyle} onClick={() => setIsEditing(true)}>
                <Edit width={'22px'} height={'22px'} />
              </button>
            )}
          </div>
          <div css={flexStyle(10)}>
            <span>닉네임</span>
            {isEditing ? (
              <div css={nicknameContainerStyle}>
                <input
                  css={inputStyle}
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  placeholder="새 닉네임"
                />
                <button css={saveButtonStyle} onClick={handleSaveNickname}>
                  저장
                </button>
              </div>
            ) : (
              <div css={nicknameContainerStyle}>
                <div css={inputStyle}>{participants[socket?.id || '']?.nickname || '알 수 없음'}</div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileEditButton;
