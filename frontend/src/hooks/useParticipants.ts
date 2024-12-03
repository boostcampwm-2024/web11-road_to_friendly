import { useEffect, useState } from 'react';

import { useSocketStore, useParticipantsStore } from '@/stores';
import { ParticipantItem } from '@/types';
import { convertArrayToObject } from '@/utils';

const useParticipants = (roomId: string | null, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  const { socket, connect, disconnect } = useSocketStore();
  const { hostId, setHostId, participants, setParticipants } = useParticipantsStore();
  const [roomExists, setRoomExists] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 참가자 목록 응답 처리
  const handleJoinResponse = (response: {
    status: string;
    body: { participants: ParticipantItem[]; hostId: string };
  }) => {
    setRoomExists(response.status === 'ok');
    if (response.status === 'ok') {
      // 참가자 목록에 index 추가
      const participantsWithIndex = response.body.participants.map((participant, index) => ({
        ...participant,
        index
      }));

      setParticipants(convertArrayToObject(participantsWithIndex));
      setHostId(response.body.hostId);
      setLoading(false);
    }
    setCurrentUserId(socket?.id || null);
  };

  const handleParticipantJoin = (newParticipant: { participantId: string; nickname: string }) => {
    setParticipants((prev) => {
      const nextIndex = Object.keys(prev).length;
      return {
        ...prev,
        [newParticipant.participantId]: {
          index: nextIndex,
          id: newParticipant.participantId,
          nickname: newParticipant.nickname
        }
      };
    });
  };

  const handleParticipantExit = (Participant: { participantId: string; nickname: string }) => {
    setParticipants((prev) => {
      const newParticipants = { ...prev };
      delete newParticipants[Participant.participantId];
      return newParticipants;
    });
  };

  const handleHostChange = (Host: { participantId: string; nickname: string }) => {
    setHostId(Host.participantId);
  };

  useEffect(() => {
    if (!socket) {
      connect();
    }

    if (socket && roomId) {
      socket.emit('join', { roomId }, handleJoinResponse);

      // 새로운 참여자 알림 이벤트
      socket.on('participant:join', handleParticipantJoin);

      // 참여자 퇴장 이벤트
      socket.on('participant:exit', handleParticipantExit);

      //호스트 변경 알림 이벤트
      socket.on('participant:host:change', handleHostChange);
      return () => {
        socket.off('participant:join', handleParticipantJoin);
        socket.off('participant:exit', handleParticipantExit);
        socket.off('participant:host:change', handleHostChange);
        disconnect();
      };
    }
  }, [socket, roomId, setParticipants]);

  return { participants, hostId, currentUserId, roomExists };
};

export default useParticipants;
