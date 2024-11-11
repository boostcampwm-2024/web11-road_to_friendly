import { ToastOption, ToastProps } from '@/types';
import { Toast } from '@components/common';
import { createContext, useState } from 'react';
import CheckIcon from '@/assets/icons/check.svg?react';
import WarnIcon from '@/assets/icons/warn.svg?react';
import { Variables } from '@/styles';

interface ToastContextType {
  toast: boolean;
  openToast: (option: ToastOption) => void;
  closeToast: () => void;
}

export const ToastContext = createContext<ToastContextType>({
  toast: false,
  openToast: () => {},
  closeToast: () => {}
});

const iconMap = {
  check: () => <CheckIcon css={{ fill: Variables.colors.text_word_weak, width: '1.5rem' }} />,
  error: () => <WarnIcon css={{ fill: Variables.colors.player_red, width: '1.5rem' }} />
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState<ToastProps | undefined>(undefined);

  const openToast = ({ icon, text, type = 'check', duration, position }: ToastOption) => {
    const iconProp = icon || iconMap[type];
    setToast(true);
    setToastProps({
      icon: iconProp,
      text,
      ...(duration !== undefined && { duration }),
      ...(position !== undefined && { position })
    });
  };
  const closeToast = () => setToast(false);

  return (
    <ToastContext.Provider value={{ toast, openToast, closeToast }}>
      {children}
      {toast && toastProps && <Toast {...toastProps} />}
    </ToastContext.Provider>
  );
};
