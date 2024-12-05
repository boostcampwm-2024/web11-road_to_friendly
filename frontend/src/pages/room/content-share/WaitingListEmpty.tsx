import { css } from '@emotion/react';

import { useModal } from '@/hooks/useModal';

import { flexStyle, Variables } from '@/styles';

import ContentEnrollModal from './contentEnrollModal';

const WaitingListEmpty = () => {
  const { ModalWithOverlay: Modal, isOpen, closeModal, openModal } = useModal();

  return (
    <>
      <div
        css={css([
          flexStyle(0, 'column', 'space-between', 'center'),
          { position: 'relative', width: '100%', height: '100%', margin: '1.75rem 1.25rem' }
        ])}
      >
        <div css={css(flexStyle(32, 'column'))}>
          <h1 css={css({ font: Variables.typography.font_bold_32, color: Variables.colors.text_default })}>
            공유 대기 목록이 비어있어요!
          </h1>
          <p css={css([{ font: Variables.typography.font_medium_20, color: '#4c4c4c' }, flexStyle(1, 'column')])}>
            <span>관심사를 어필할 수 있는 컨텐츠를 함께 나눠보는 건 어때요?</span>
            <span>하단의 버튼을 눌러 공유할 수 있어요!</span>
          </p>
        </div>
        <button
          css={css({
            backgroundColor: Variables.colors.surface_orange_strong,
            color: Variables.colors.text_white,
            width: '100%',
            padding: '16px 0',
            borderRadius: '999px',
            font: Variables.typography.font_bold_20,
            transition: 'transform 0.2s ease',
            '&:hover': { transform: 'scale(1.05)' }
          })}
          onClick={openModal}
        >
          컨텐츠 공유 시작하기 ✨
        </button>
      </div>
      <Modal isOpen={isOpen} closeModal={closeModal}>
        <ContentEnrollModal closeModal={closeModal} />
      </Modal>
    </>
  );
};

export default WaitingListEmpty;
