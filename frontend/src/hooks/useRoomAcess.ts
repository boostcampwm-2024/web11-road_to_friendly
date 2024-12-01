import { useRoomAccessStore } from '@/stores';
import { useEffect } from 'react';

export const useRoomAccess = () => {
  const { canAccess, connect, disconnect } = useRoomAccessStore();

  if (canAccess === null) connect();

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return { canAccess };
};
