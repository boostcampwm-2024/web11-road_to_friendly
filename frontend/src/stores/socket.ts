import { Socket, io } from 'socket.io-client';
import { create } from 'zustand';

import { config } from '@/config';
import { SocketWithWorker } from '@/types';
import SocketSharedWorker from '@/workers/socketSharedWorker.js?sharedworker';

interface SocketStore {
  socket: Socket | SocketWithWorker | null;
  connect: () => void;
  disconnect: () => void;
}

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const listenersMap = new Map<string, Function[]>();
const callbackMap = new Map<string, Function>();

let emitReqeustCounter = 0;

const handleOn = (socketWorker: SharedWorker, eventName: string, listener: Function) => {
  if (!listenersMap.has(eventName)) {
    listenersMap.set(eventName, []);
  }
  listenersMap.get(eventName)?.push(listener);

  socketWorker.port.postMessage({ message: 'on', data: { eventName } });
};

const handleOff = (socketWorker: SharedWorker, eventName: string, listener?: Function) => {
  if (listener) {
    const listeners = listenersMap.get(eventName);
    if (listeners) {
      listenersMap.set(
        eventName,
        listeners.filter((element: Function) => element !== listener)
      );
    }
  } else {
    listenersMap.delete(eventName);
  }
  socketWorker.port.postMessage({ message: 'off', data: { eventName } });
};

const handleEmit = (socketWorker: SharedWorker, eventName: string, body?: any, callback?: Function) => {
  if (callback) {
    const eventWithId = `${eventName}${emitReqeustCounter++}`;
    const handleCallbackOnce = (res) => {
      callback(res);
      callbackMap.delete(eventWithId);
    };

    socketWorker.port.postMessage({ message: 'emit', data: { eventName, body, callbackId: eventWithId } });
    callbackMap.set(eventWithId, handleCallbackOnce);
  } else {
    socketWorker.port.postMessage({ message: 'emit', data: { eventName, body } });
  }
};

const getSocketWorker = (): SocketWithWorker => {
  const socketWorker = new SocketSharedWorker();
  socketWorker.port.start();

  return {
    socketWorker: socketWorker,
    id: null,
    connected: false,
    on: (eventName, listener?) => handleOn(socketWorker, eventName, listener),
    off: (eventName, listener?) => handleOff(socketWorker, eventName, listener),
    emit: (eventName: string, body?: any, callback?: Function) => {
      handleEmit(socketWorker, eventName, body, callback);
    }
  };
};

const runListeners = (eventName: string, body?: any) => {
  const listeners = listenersMap.get(eventName);
  if (listeners) {
    listeners.forEach((listener: Function) => listener(body));
  }
};

const runCallback = (callbackId: string, res: any) => {
  const callback = callbackMap.get(callbackId);
  if (callback) {
    callback(res);
  }
};

const connectWithSocketWorker = (socket: SocketWithWorker, resolve) => {
  const { socketWorker } = socket;

  socketWorker.port.onmessage = (e) => {
    const { message, data } = e.data;

    if (message === 'connected') {
      const { id } = data;
      socket.id = id;
      socket.connected = true;
      resolve();
    } else if (message === 'disconnected') {
      socket.connected = false;
    } else if (message === 'emit') {
      const { eventName, body } = data;
      runListeners(eventName, body);
    } else if (message === 'response') {
      // emit의 callback으로 오는 response 처리
      const { callbackId, res } = data;
      runCallback(callbackId, res);
    } else if (message === 'reject') {
      // 이미 연결된 탭이 존재할 경우 거부당함, 처리 필요
      // socket을 null로 비워주고, 랜딩페이지로 리다이렉트하거나 모달 띄워주기?
    }
  };
  socketWorker.port.postMessage({ message: 'connect', data: { url: config.SOCKET_SERVER_URL } });
};

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,

  connect: () => {
    if (IS_PRODUCTION) {
      const socketInstance = getSocketWorker();
      const connectPromise = new Promise((resolve, reject) => {
        connectWithSocketWorker(socketInstance, resolve);
      });

      connectPromise.then(() => {
        set({ socket: socketInstance });
      });
    } else {
      const socketInstance = io(config.SOCKET_SERVER_URL);
      set({ socket: socketInstance });
    }
  },

  disconnect: () => {
    set((state) => {
      if (state.socket) {
        if (state.socket instanceof Socket) {
          state.socket.disconnect();
        }
      }
      return { socket: null };
    });
  }
}));
