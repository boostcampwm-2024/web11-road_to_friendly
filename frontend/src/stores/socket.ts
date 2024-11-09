import { create } from 'zustand';
import { Socket, io } from 'socket.io-client';
import { config } from '../config';

interface SocketStore {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,

  connect: () => {
    const socketInstance = io(config.SOCKET_SERVER_URL);
    set({ socket: socketInstance });
  },

  disconnect: () => {
    set((state) => {
      if (state.socket) {
        state.socket.disconnect();
      }
      return { socket: null };
    });
  }
}));
