import { useEffect, useState } from 'react';
import useSocket from '../../hooks/useSocket';
import RoomNotFoundError from '../../components/RoomNotFound';
import UserProfile from '../../components/UserProfile';
import { useParams } from 'react-router-dom';
import HostView from './hostView';
import ParticipantView from './participantView';
import useParticipantsStore from '../../stores/participants';
import { Variables } from '../../styles/Variables';
import { css } from '@emotion/react';
// import { Header } from '../../components/common';

const backgroundStyle = css`
  background: ${Variables.colors.surface_default};
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit(
        'join',
        { roomId },
        (response: { status: boolean; body: { participants: Participant[]; hostFlag: boolean } }) => {
          console.log(response);
          setRoomExists(response.status);
          setParticipants(response.body.participants);
          setIsHost(response.body.hostFlag);
          if (socket.id) setCurrentUserId(socket.id);
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
    <>
      {/* <Header /> */}
      <div css={backgroundStyle}>
        <div
          css={css`
            display: flex;
            margin-bottom: ${Variables.spacing.spacing_lg};
          `}
        >
          {participants.map((participant, index) => (
            <UserProfile participant={participant} index={index} isCurrentUser={participant.id === currentUserId} />
          ))}
        </div>
        {isHost ? <HostView participantCount={participants.length} /> : <ParticipantView />}
        <button>링크로 복사하기</button>
      </div>
    </>
  );
};

export default Room;
