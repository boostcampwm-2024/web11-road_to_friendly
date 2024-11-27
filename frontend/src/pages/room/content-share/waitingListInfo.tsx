import { css } from '@emotion/react';

import PlusIcon from '@/assets/icons/plus.svg?react';
import { flexStyle, Variables } from '@/styles';
import { useModal } from '@/hooks/useModal';
import ContentEnrollModal from './contentEnrollModal';

interface WaitingListInfoProps {
  numWaiting: number;
}

const WaitingListInfo = ({ numWaiting }: WaitingListInfoProps) => {
  const WaitingListInfoStyle = css({
    position: 'relative',
    width: '100%',
    padding: '6px 0',
    textAlign: 'center',
    font: Variables.typography.font_medium_18,
    color: `${numWaiting > 0 ? Variables.colors.text_word_medium : Variables.colors.text_alt}`,
    backgroundColor: `${numWaiting > 0 ? '#EFFFF7' : Variables.colors.surface_default}`,
    borderRadius: '999px',
    border: `1px solid ${numWaiting > 0 ? Variables.colors.surface_green_strong : Variables.colors.text_weak}`
  });

  const EnrollButtonStyle = css([
    {
      width: 24,
      height: 24,
      position: 'absolute',
      top: '50%',
      right: 36,
      transform: 'translateY(-50%)',
      borderRadius: '999px',
      backgroundColor: Variables.colors.surface_green_strong,
      color: Variables.colors.text_white,
      font: Variables.typography.font_medium_20
    }
  ]);

  const { ModalWithOverlay: Modal, isOpen, closeModal, openModal } = useModal();

  return (
    <>
      <div css={WaitingListInfoStyle}>
        {numWaiting > 0 && `현재 공유 대기 목록에 ${numWaiting}개의 컨텐츠가 있어요`}
        {numWaiting === 0 && `공유 대기 목록이 비어있어요. 지금 예약하면 바로 공유할 수 있어요!`}
        <button css={EnrollButtonStyle} onClick={openModal}>
          <PlusIcon fill={Variables.colors.surface_default} />
        </button>
      </div>
      <Modal isOpen={isOpen} closeModal={closeModal}>
        <ContentEnrollModal closeModal={closeModal} />
      </Modal>
    </>
  );
};

export default WaitingListInfo;
