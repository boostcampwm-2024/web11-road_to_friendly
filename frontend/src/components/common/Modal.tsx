import { css } from '@emotion/react';

import { Variables } from '@/styles';
import CloseX from '@/assets/icons/closeX.svg?react';

const ModalOverlayStyle = css`
  position: relative;
  background-color: ${Variables.colors.surface_transparent_black_50};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContentStyle = (top?: string, left?: string, right?: string, bottom?: string, isCenter?: boolean) => css`
  position: absolute;
  top: ${top ? top : 'unset'};
  left: ${left ? left : 'unset'};
  right: ${right ? right : 'unset'};
  bottom: ${bottom ? bottom : 'unset'};
  ${isCenter && 'transform: translate(-50%, -50%);'}
  background-color: ${Variables.colors.surface_white};
  max-width: 300px;
  max-height: 600px;
  padding: ${Variables.spacing.spacing_sm};
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 999; /* overlay보다 위에 위치 */
`;

const closeButtonStyle = css`
  position: absolute;
  top: 10px;
  right: 10px;
`;

// 모달 컴포넌트
const Modal = ({
  closeButton = false,
  isOpen,
  onClose,
  children,
  position = 'center'
}: {
  closeButton?: boolean;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position: 'topLeft' | 'topRight' | 'bottomRight' | 'center';
}) => {
  if (!isOpen) return null;

  // 위치에 따라 top, left, right, bottom 값을 결정
  const getPosition = () => {
    switch (position) {
      case 'topLeft':
        return { top: '24px', left: '24px', right: 'unset', bottom: 'unset', isCenter: false };
      case 'topRight':
        return { top: '120px', left: 'unset', right: '24px', bottom: 'unset', isCenter: false };
      case 'bottomRight':
        return { top: 'unset', left: 'unset', right: '24px', bottom: '24px', isCenter: false };
      default:
        return { top: '50%', left: '50%', right: 'unset', bottom: 'unset', isCenter: true };
    }
  };

  const positionStyle = getPosition();

  return (
    <>
      <div css={ModalOverlayStyle} onClick={onClose}></div>
      <div
        css={ModalContentStyle(
          positionStyle.top,
          positionStyle.left,
          positionStyle.right,
          positionStyle.bottom,
          positionStyle.isCenter
        )}
      >
        {children}
        {closeButton && (
          <button css={closeButtonStyle} onClick={onClose}>
            <CloseX width={'15px'} height={'15px'} />
          </button>
        )}
      </div>
    </>
  );
};

export default Modal;
