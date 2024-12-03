import { css } from '@emotion/react';
import { useLocation, useNavigate } from 'react-router-dom';

import ProfileEditButton from '@/components/ProfileEditButton';

import { useSocketStore } from '@/stores';
import { flexStyle, Variables } from '@/styles';
import { useModal } from '@/hooks/useModal';
import TutorialModal from '../TutorialModal';

const headerWrapperStyle = css({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  width: '100%',
  padding: '10px 24px',
  minHeight: '80px',
  zIndex: 1000
});

const headerStyle = (paddingY: number) =>
  css({
    backgroundColor: Variables.colors.surface_white,
    width: '100%',
    borderRadius: 999,
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${paddingY}px 32px`,
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  });

const navStyle = css({
  display: 'flex',
  gap: 24,
  color: Variables.colors.text_default,
  font: Variables.typography.font_medium_16
});

interface HeaderProps {
  paddingY?: number;
}

const Header = ({ paddingY = 12 }: HeaderProps) => {
  const { ModalWithOverlay: Modal, isOpen, openModal, closeModal } = useModal();
  const location = useLocation();
  const navigate = useNavigate();


  return (
    <>
      <header css={headerWrapperStyle}>
        <div css={headerStyle(paddingY)}>
          <button css={flexStyle(0)} onClick={() => navigate('/')}>
            <img src="/logo.png" alt="logo" height={'40px'} />
          </button>
          <nav css={navStyle}>
            <button onClick={openModal}>튜토리얼</button>
            {location.pathname !== '/' && <ProfileEditButton />}
          </nav>
        </div>
      </header>
      <Modal isOpen={isOpen} closeModal={closeModal}>
        <TutorialModal closeModal={closeModal} />
      </Modal>
    </>
  );
};

export default Header;
