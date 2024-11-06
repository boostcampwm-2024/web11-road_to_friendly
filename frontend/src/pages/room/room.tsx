import { useEffect, useState } from 'react';
import useSocket from '../../hooks/useSocket';
import RoomNotFoundError from '../../components/RoomNotFound';
import { useParams } from 'react-router-dom';
import HostView from './hostView';
import ParticipantView from './participantView';
import useParticipantsStore from '../../stores/participants';

interface Participant {
  id: string;
  nickname: string;
}

const Room = () => {
  const socket = useSocket();
  const { roomId } = useParams<{ roomId: string }>();
  const [isHost, setIsHost] = useState(false);
  const [roomExists, setRoomExists] = useState(true);
  const { participants, setParticipants } = useParticipantsStore();

  useEffect(() => {
    if (socket && roomId) {
      socket.emit('join', { roomId });

      //새로운 참여자에게 오는 이벤트
      socket.on(
        'participant:info:list',
        (response: { success: boolean; participants: Participant[]; hostFlag: boolean }) => {
          // setRoomExists(response.success);
          setParticipants(response.participants);
          setIsHost(response.hostFlag);
        }
      );

      //기존 참여자에게 오는 이벤트
      socket.on('participant:join', (newParticipant: { participantId: string; nickname: string }) => {
        setParticipants((prev) => [...prev, { id: newParticipant.participantId, nickname: newParticipant.nickname }]);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [socket, roomId, setParticipants]);

  if (!roomExists) return <RoomNotFoundError></RoomNotFoundError>;

  return (
    <div>
      {/* <Header></Header> */}
      <h1>roomID:{roomId}</h1>
      {participants.map((participant) => (
        <div>
          <div>🐯</div>
          <div>{participant.nickname}</div>
        </div>
      ))}
      {isHost ? <HostView participantCount={participants.length} /> : <ParticipantView />}
      <button>링크로 복사하기</button>
    </div>
  );
};

export default Room;
