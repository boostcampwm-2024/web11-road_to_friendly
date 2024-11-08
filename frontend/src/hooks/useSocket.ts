import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { config } from '../config';

export const useSocket = () => {
  // socket 유지를 위해 state에 socket 인스턴스를 담아서 사용
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // 소켓 연결
    const socketInstance = io(config.SOCKET_SERVER_URL);
    setSocket(socketInstance);

    return () => {
      // 컴포넌트 언마운트 시 소켓 연결 해제
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return socket;
};