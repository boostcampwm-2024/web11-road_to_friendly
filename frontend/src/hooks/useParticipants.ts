import { useEffect, useState } from 'react';
import { useSocketStore } from '@/stores';
import { convertArrayToObject } from '@/utils';
import { ParticipantItem } from '@/types';
import { useParticipantsStore } from '@/stores';

const useParticipants = (roomId: string | null, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  const { socket, connect, disconnect } = useSocketStore();
  const { hostId, participants, setParticipants, setHostId } = useParticipantsStore();
  const [roomExists, setRoomExists] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 참가자 목록 응답 처리
  const handleJoinResponse = (response: {
    status: string;
    body: { participants: ParticipantItem[]; hostId: string };
  }) => {
    setRoomExists(response.status === 'ok');
    if (response.status === 'ok') {
      setParticipants(convertArrayToObject(response.body.participants));
      setHostId(response.body.hostId);
      setLoading(false);
    }
    setCurrentUserId(socket?.id || null);
  };

  const handleParticipantJoin = (newParticipant: { participantId: string; nickname: string }) => {
    setParticipants((prev) => ({
      ...prev,
      [newParticipant.participantId]: {
        id: newParticipant.participantId,
        nickname: newParticipant.nickname
      }
    }));
  };

  useEffect(() => {
    if (!socket) {
      connect();
    }

    if (socket && roomId) {
      socket.emit('join', { roomId }, handleJoinResponse);

      // 새로운 참여자 알림 이벤트
      socket.on('participant:join', handleParticipantJoin);

      return () => {
        socket?.off('participant:join', handleParticipantJoin);
        disconnect();
      };
    }
  }, [socket, roomId, setParticipants]);

  return { participants, hostId, currentUserId, roomExists };
};

export default useParticipants;
