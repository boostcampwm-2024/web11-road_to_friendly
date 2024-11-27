import { useState } from 'react';

import { ModalWithOverlay } from '@/components/common';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    ModalWithOverlay,
    isOpen,
    openModal,
    closeModal
  };
};
