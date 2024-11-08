import { css } from '@emotion/react';
import { useState } from 'react';
import { Variables } from '../styles';
import Modal from './common/Modal';

const ListContainerStyle = css`
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

const ParticipantListSidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div
        css={SidebarTriggerArea}
        onMouseEnter={() => setIsModalOpen(true)}
        onMouseLeave={() => setIsModalOpen(false)}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div css={ListContainerStyle}>참여자 리스트</div>
      </Modal>
    </div>
  );
};

export default ParticipantListSidebar;
