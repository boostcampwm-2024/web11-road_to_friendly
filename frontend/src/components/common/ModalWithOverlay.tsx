import { css } from '@emotion/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

import { flexStyle, Variables } from '@/styles';

import ModalPortal from './ModalPortal';

interface ModalWithOverlayProps {
  children: ReactNode;
  isOpen: boolean;
  closeModal: () => void;
}

const overlayAnimationVariants = {
  hidden: {
    backdropFilter: 'blur(0px)',
    opacity: 0
  },
  visible: {
    backdropFilter: 'blur(4px)',
    opacity: 1
  },
  exit: {
    backdropFilter: 'blur(0px)',
    opacity: 0
  }
};

const wrapperAnimationVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

const ModalWithOverlay = ({ children, isOpen, closeModal }: ModalWithOverlayProps) => {
  const overlayClickHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    closeModal();
  };

  return (
    <ModalPortal>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            css={Overlay}
            variants={overlayAnimationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onClick={overlayClickHandler}
          >
            <motion.div
              layout
              variants={wrapperAnimationVariants}
              css={Wrapper}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ModalPortal>
  );
};

export default ModalWithOverlay;

const Overlay = css([
  {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  flexStyle(0)
]);

const Wrapper = css({
  backgroundColor: Variables.colors.surface_white,
  padding: 24,
  borderRadius: 16,
  minWidth: 300
});
