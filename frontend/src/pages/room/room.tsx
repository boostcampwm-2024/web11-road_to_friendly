import { useEffect, useState } from 'react';
import useSocket from '../../hooks/useSocket';
import RoomNotFoundError from '../../components/RoomNotFound';
import { useParams } from 'react-router-dom';
import HostView from './hostView';
import ParticipantView from './participantView';
import useParticipantsStore from '../../stores/participants';

interface participant {
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

      socket.on(
        'participant:info:list',
        (response: { success: boolean; participants: participant[]; hostFlag: boolean }) => {
          setRoomExists(response.success);
          setParticipants(response.participants);
          setIsHost(response.hostFlag);
        }
      );

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
