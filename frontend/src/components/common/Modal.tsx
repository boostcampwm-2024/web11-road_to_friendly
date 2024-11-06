import { css } from '@emotion/react';
import { Variables } from '../../styles/Variables';

const ModalOverlayStyle = css`
  position: relative;
  background-color: ${Variables.colors.surface_transparent_black_50};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContentStyle = css`
  position: absolute;
  top: ${Variables.spacing.spacing_lg};
  left: ${Variables.spacing.spacing_md};
  background-color: ${Variables.colors.surface_white};
  max-width: 300px;
  height: 600px;
  padding: ${Variables.spacing.spacing_sm};
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 101; /* overlay보다 위에 위치 */
`;

// 모달 컴포넌트
const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <>
      <div css={ModalOverlayStyle} onClick={onClose}></div>
      <div css={ModalContentStyle}>
        {children}
        <button css={css``} onClick={onClose}>
          닫기
        </button>
      </div>
    </>
  );
};

export default Modal;
