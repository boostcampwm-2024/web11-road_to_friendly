import { useEffect } from 'react';

import { roomError } from '@/constants/roomError';
import { useRoomAccessStore } from '@/stores';
export const useRoomAccess = () => {
  const { canAccess, connect, disconnect } = useRoomAccessStore();

  if (canAccess === null) connect();

  if (canAccess === false) throw new Error(roomError.RoomAlreadyEnter);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return { canAccess, disconnect };
};
