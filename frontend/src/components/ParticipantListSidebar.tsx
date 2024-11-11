import { css } from '@emotion/react';
import { useState } from 'react';

import { Variables } from '@/styles';

import Modal from './common/Modal';
import { useParticipantsStore } from '@/stores';

import Profile from '@/assets/icons/profile.svg?react';

const ListContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px;
  width: 200px;
  height: 95%;
`;

const SidebarTriggerArea = css`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${Variables.spacing.spacing_lg};
  background-color: transparent;
  &:hover {
    cursor: pointer;
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
      <div
        css={SidebarTriggerArea}
        onMouseEnter={() => setIsModalOpen(true)}
        onMouseLeave={() => setIsModalOpen(false)}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div css={ListContainerStyle}>
          <div>참여자 리스트</div>
          {participants.map((participant) => (
            <div key={participant.id} css={ParticipantItemStyle}>
              <Profile/>
              <span>{participant.nickname}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default ParticipantListSidebar;
