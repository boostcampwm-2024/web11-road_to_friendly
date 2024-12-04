import { create } from 'zustand';

import RoomAccessWorker from '@/workers/roomAccessWorker.js?sharedworker';
import TimerWorker from '@/workers/timerWorker.js?worker';

type HandleRoomAccess = () => Promise<SharedWorker | null>;

interface RoomAccess {
  roomAccessWorker: SharedWorker | null;
  timerWorker: Worker | null;
  canAccess: boolean | null;
  connect: () => void;
  disconnect: () => void;
}

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const TIMEOUT = 3000;
let isConnecting = false;

const postAliveSignal = (roomAccessWorker: SharedWorker | null) => {
  if (!roomAccessWorker) return;

  roomAccessWorker.port.postMessage({ message: 'alive' });
};

const clearWorker = (roomAccessWorker: SharedWorker | null, timerWorker?: Worker | null) => {
  if (roomAccessWorker) {
    roomAccessWorker.port.onmessage = null;
    roomAccessWorker.port.close();
  }
  if (timerWorker) {
    timerWorker.postMessage({ action: 'stop' });
    timerWorker.onmessage = null;
    timerWorker.terminate();
  }
};

const handleRoomAccess: HandleRoomAccess = () => {
  return new Promise((resolve, reject) => {
    if (IS_PRODUCTION) {
      const workerInstance = new RoomAccessWorker();

      isConnecting = true;
      workerInstance.port.start();

      workerInstance.port.onmessage = (e) => {
        const { message } = e.data;
        if (message === 'reject') {
          clearWorker(workerInstance);
          reject();
        } else if (message === 'accept') {
          resolve(workerInstance);
        }
      };
    } else {
      resolve(null);
    }
  });
};

const handleRoomLeave = (roomAccessWorker: SharedWorker | null, timerWorker: Worker | null) => {
  if (IS_PRODUCTION) {
    clearWorker(roomAccessWorker, timerWorker);
  }
};

export const useRoomAccessStore = create<RoomAccess>((set) => ({
  roomAccessWorker: null,
  timerWorker: null,
  canAccess: null,

  connect: async () => {
    if (isConnecting) return;

    try {
      const workerInstance = await handleRoomAccess();

      set({ roomAccessWorker: workerInstance, canAccess: true });
      set((state) => {
        const timerWorkerInstance = new TimerWorker();
        timerWorkerInstance.postMessage({ action: 'start', interval: TIMEOUT });
        timerWorkerInstance.onmessage = (e) => {
          if (e.data === 'tick') {
            postAliveSignal(state.roomAccessWorker);
          }
        };

        return { ...state, timerWorker: timerWorkerInstance };
      });
    } catch (e) {
      set({ roomAccessWorker: null, canAccess: false });
    } finally {
      isConnecting = false;
    }
  },

  disconnect: () => {
    set((state) => {
      state.roomAccessWorker?.port.postMessage({ message: 'disconnect' });
      handleRoomLeave(state.roomAccessWorker, state.timerWorker);
      return { roomAccessWorker: null, canAccess: null, timerWorker: null };
    });
  }
}));
