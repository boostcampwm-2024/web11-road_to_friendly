import { css } from '@emotion/react';
import { useState } from 'react';

import Menu from '@/assets/icons/menu.svg?react';
import Profile from '@/assets/icons/profile.svg?react';
import { useParticipantsStore } from '@/stores';
import { Variables } from '@/styles';

import Modal from './common/Modal';

const ListContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px;
  width: 200px;
  height: 500px;
  overflow: auto;
`;

const SidebarButtonStyle = (isSidebarOpen: boolean) => css`
  position: absolute;
  left: ${isSidebarOpen ? '250px' : '10px'};
  top: 50%;
  transform: translateY(-50%);
  transition: left 0.3s ease-in-out; /* 버튼 이동 애니메이션 */
  background: none;
  border: none;
  cursor: pointer;
  svg {
    transform: ${isSidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)'}; /* 버튼 방향 */
  }
`;

const ParticipantItemStyle = css`
  display: flex;
  gap: 7px;
  align-items: center;
  span {
    font: ${Variables.typography.font_medium_16};
  }
`;

const ParticipantListSidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { participants } = useParticipantsStore();

  return (
    <div>
      <button css={SidebarButtonStyle(isModalOpen)} onClick={() => setIsModalOpen(!isModalOpen)}>
        <Menu width={30} height={30} />
      </button>
      <Modal position={'topLeft'} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div css={ListContainerStyle}>
          <div>참여자 리스트</div>
          {Object.keys(participants).map((participantId) => (
            <div key={participantId} css={ParticipantItemStyle}>
              <Profile />
              <span>{participants[participantId].nickname}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default ParticipantListSidebar;
