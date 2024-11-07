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
import ParticipantListSidebar from '../../components/ParticipantListSidebar';
import { ShareButton } from '../../components';
import LoadingPage from '../LoadingPage';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit(
        'join',
        { roomId },
        (response: { status: string; body: { participants: Participant[]; hostFlag: boolean } }) => {
          setRoomExists(response.status === 'ok' ? true : false);
          setParticipants(response.body.participants);
          setIsHost(response.body.hostFlag);
          setLoading(false);
          if (socket.id) setCurrentUserId(socket.id);
        }
      );

      //새로운 참여자 알림 이벤트
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
      {loading ? (
        <LoadingPage />
      ) : (
        <>
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
            <ShareButton />
          </div>
          <ParticipantListSidebar />
        </>
      )}
    </>
  );
};

export default Room;
