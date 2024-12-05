import { roomError } from '@/constants/roomError';
import { useEffect, useState } from 'react';

const IS_PRODUCTION = import.meta.env.MODE === 'production' || true;
const TIMEOUT = 150;

const accessChannel = new BroadcastChannel('accessChannel');

export const useCheckRoomAccess = () => {
  if (!IS_PRODUCTION) return;

  const [canAccess, setCanAccess] = useState<boolean | null>(null);

  const disconnect = () => {
    accessChannel.onmessage = null;
  };

  useEffect(() => {
    return () => disconnect();
  }, []);

  const checkPromise = () => {
    return Promise.race([
      new Promise<boolean>((resolve) => {
        accessChannel.onmessage = (e: MessageEvent) => {
          if (canAccess !== null) return;

          const { message } = e.data;
          if (message === 'hasAlreadyEnter') {
            disconnect();
            resolve(false);
          }
        };
        accessChannel?.postMessage({ message: 'question' });
      }),
      new Promise<boolean>((resolve) => {
        setTimeout(() => {
          accessChannel.onmessage = null;
          resolve(true);
        }, TIMEOUT);
      })
    ]);
  };

  const addResponse = () => {
    accessChannel.onmessage = (e: MessageEvent) => {
      const { message } = e.data;
      if (message === 'question') {
        accessChannel?.postMessage({ message: 'hasAlreadyEnter' });
      }
    };
  };

  const checkAccess = async () => {
    const access = await checkPromise();

    if (access) addResponse();
    setCanAccess(access);
  };

  if (canAccess === null) checkAccess();

  if (canAccess === false) throw new Error(roomError.RoomAlreadyEnter);
};
