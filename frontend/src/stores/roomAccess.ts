import RoomAccessWorker from '@/workers/roomAccessWorker.js?sharedworker';
import { create } from 'zustand';

type HandleRoomAccess = () => Promise<SharedWorker | null>;

interface RoomAccess {
  roomAccessWorker: SharedWorker | null;
  canAccess: boolean | null;
  connect: () => void;
  disconnect: () => void;
}

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const TIMEOUT = 1000;
let isConnecting = false;

const postAliveSignal = (roomAccessWorker: SharedWorker | null) => {
  if (!roomAccessWorker) return;

  roomAccessWorker.port.postMessage({ message: 'alive' });
  setTimeout(() => postAliveSignal(roomAccessWorker), TIMEOUT);
};

const clearWorker = (roomAccessWorker: SharedWorker | null) => {
  if (!roomAccessWorker) return;
  roomAccessWorker.port.onmessage = null;
  roomAccessWorker.port.close();
};

const handleRoomAccess: HandleRoomAccess = () => {
  return new Promise((resolve, reject) => {
    if (IS_PRODUCTION) {
      const workerInstance = new RoomAccessWorker();

      workerInstance.port.start();
      isConnecting = true;

      workerInstance.port.onmessage = (e) => {
        const { message } = e.data;
        if (message === 'reject') {
          isConnecting = false;
          clearWorker(workerInstance);
          reject();
        } else if (message === 'accept') {
          isConnecting = false;
          resolve(workerInstance);
        }
      };
    } else {
      resolve(null);
    }
  });
};

const handleRoomLeave = (roomAccessWorker: SharedWorker | null) => {
  if (IS_PRODUCTION) {
    clearWorker(roomAccessWorker);
  }
};

export const useRoomAccessStore = create<RoomAccess>((set) => ({
  roomAccessWorker: null,
  canAccess: null,

  connect: async () => {
    if (isConnecting) return;

    try {
      const workerInstance = await handleRoomAccess();

      set({ roomAccessWorker: workerInstance, canAccess: true });
      set((state) => {
        postAliveSignal(state.roomAccessWorker);
        return state;
      });
    } catch (e) {
      set({ roomAccessWorker: null, canAccess: false });
    }
  },

  disconnect: () => {
    set((state) => {
      handleRoomLeave(state.roomAccessWorker);
      return { roomAccessWorker: null, canAccess: null };
    });
  }
}));
