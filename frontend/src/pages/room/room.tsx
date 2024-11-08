import { useEffect, useMemo, useState } from 'react';
import { useSocket } from '../../hooks';
import RoomNotFoundError from '../../components/RoomNotFound';
import UserProfile from '../../components/UserProfile';
import { useParams } from 'react-router-dom';
import HostView from './hostView';
import ParticipantView from './participantView';
import useParticipantsStore from '../../stores/participants';
import { Variables } from '../../styles/Variables';
import { css } from '@emotion/react';
import ParticipantListSidebar from '../../components/ParticipantListSidebar';
import { calculatePosition } from '../../utils/arrangement';
import useRadiusStore from '../../stores/radius';

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
  const socket = useSocket();
  const { roomId } = useParams<{ roomId: string }>();
  const [isHost, setIsHost] = useState(false);
  const [roomExists, setRoomExists] = useState(true);
  const { participants, setParticipants } = useParticipantsStore();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { radius, increaseRadius } = useRadiusStore();
  const positions = useMemo(() => calculatePosition(participants.length, radius), [radius, participants]);

  const calculateRadius = (count: number) => {
    if (count > 3) {
      increaseRadius();
    }
  };

  // 참여자 수가 변경될 때마다 반지름 계산
  useEffect(() => {
    calculateRadius(participants.length);
  }, [participants]);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit(
        'join',
        { roomId },
        (response: { status: string; body: { participants: Participant[]; hostFlag: boolean } }) => {
          setRoomExists(response.status === 'ok');
          setParticipants(response.body.participants);
          setIsHost(response.body.hostFlag);
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

  if (!roomExists) return <RoomNotFoundError/>;

  return (
    <>
      <div css={backgroundStyle}>
        <div css={ParticipantsContainer(radius)}>
          {participants.map((participant, index) => (
            <UserProfile
              participant={participant}
              index={index}
              isCurrentUser={participant.id === currentUserId}
              isHost={true}
              position={{ x: positions[index][0], y: positions[index][1] }}
            /> //participant.id === hostId
          ))}
          <div css={SubjectContainer(radius)}>
            {isHost ? <HostView participantCount={participants.length} /> : <ParticipantView />}
          </div>
        </div>
        {/* <button>링크로 복사하기</button> */}
      </div>
      <ParticipantListSidebar />
    </>
  );
};

export default Room;
