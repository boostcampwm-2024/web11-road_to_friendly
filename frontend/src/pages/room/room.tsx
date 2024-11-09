import { useEffect, useMemo, useState } from 'react';
import RoomNotFoundError from '../../components/RoomNotFound';
import UserProfile from '../../components/UserProfile';
import { useParams } from 'react-router-dom';
import HostView from './hostView';
import ParticipantView from './participantView';
import { useParticipantsStore, useRadiusStore, useSocketStore } from '../../stores/';
import { Variables } from '../../styles/Variables';
import { css } from '@emotion/react';
import ParticipantListSidebar from '../../components/ParticipantListSidebar';
import { calculatePosition } from '../../utils/arrangement';

import { ShareButton } from '../../components';
import LoadingPage from '../LoadingPage';
import QuestionsView from './questionsView';

const backgroundStyle = css`
  background: ${Variables.colors.surface_default};
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ParticipantsContainer = (radius: number) => css`
  position: relative;
  width: ${radius * 2}px;
  height: ${radius * 2}px;
  border-radius: 50%;
`;

const SubjectContainer = (radius: number) => css`
  position: absolute;
  bottom: ${radius}px;
  left: ${radius}px;
  transform: translate(-50%, 20%);
  white-space: nowrap;
`;

interface Participant {
  id: string;
  nickname: string;
}

const Room = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const { socket, connect, disconnect } = useSocketStore();
  const { hostId, participants, setParticipants, setHostId } = useParticipantsStore();
  const { radius, increaseRadius } = useRadiusStore();

  const [roomExists, setRoomExists] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isIntroViewActive, setIsIntroViewActive] = useState(true);

  const positions = useMemo(() => calculatePosition(participants.length, radius), [radius, participants]);

  const hideIntroView = () => setIsIntroViewActive(false);

  const calculateRadius = (count: number) => {
    if (count > 3) {
      increaseRadius();
    }
  };

  useEffect(() => {
    if (!socket) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit(
        'join',
        { roomId },
        (response: { status: string; body: { participants: Participant[]; hostId: string } }) => {
          setRoomExists(response.status === 'ok');
          setParticipants(response.body.participants);
          setHostId(response.body.hostId);
          setLoading(false);
          if (socket.id) setCurrentUserId(socket.id);
        }
      );

      // 새로운 참여자 알림 이벤트
      socket.on('participant:join', (newParticipant: { participantId: string; nickname: string }) => {
        setParticipants((prev) => [...prev, { id: newParticipant.participantId, nickname: newParticipant.nickname }]);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [socket, roomId, setParticipants]);

  // 참여자 수가 변경될 때마다 반지름 계산
  useEffect(() => {
    calculateRadius(participants.length);
  }, [participants]);

  if (!roomExists) return <RoomNotFoundError />;

  return (
    <>
      {/* <Header /> */}
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div css={backgroundStyle}>
            <div css={ParticipantsContainer(radius)}>
              {participants.map((participant, index) => (
                <UserProfile
                  key={participant.id}
                  participant={participant}
                  index={index}
                  isCurrentUser={participant.id === currentUserId}
                  isHost={hostId === participant.id}
                  position={{ x: positions[index][0], y: positions[index][1] }}
                />
              ))}
              <div css={SubjectContainer(radius)}>
                {isIntroViewActive &&
                  (hostId === currentUserId ? (
                    <HostView participantCount={participants.length} />
                  ) : (
                    <ParticipantView />
                  ))}
              </div>
            </div>
            <QuestionsView onQuestionStart={hideIntroView} />
            <ShareButton />
          </div>
          <ParticipantListSidebar />
        </>
      )}
    </>
  );
};

export default Room;
