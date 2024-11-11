import { ToastContext } from '@/contexts';
import { useContext } from 'react';

export function useToast() {
  const { toast, openToast, closeToast } = useContext(ToastContext);
  return { toast, openToast, closeToast };
}
