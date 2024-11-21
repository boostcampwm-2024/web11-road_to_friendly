import { useContext } from 'react';

import { ToastContext } from '@/contexts';

export function useToast() {
  const { toast, openToast, closeToast } = useContext(ToastContext);
  return { toast, openToast, closeToast };
}
