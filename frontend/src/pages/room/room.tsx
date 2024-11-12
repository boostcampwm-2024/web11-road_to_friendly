import { css } from '@emotion/react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import ParticipantListSidebar from '@/components/ParticipantListSidebar';
import RoomNotFoundError from '@/components/RoomNotFound';
import UserProfile from '@/components/UserProfile';

import { ShareButton } from '@/components';
import { useParticipantsStore, useRadiusStore, useSocketStore } from '@/stores/';
import { Variables } from '@/styles/Variables';
import { calculatePosition } from '@/utils';

import HostView from './hostView';
import ParticipantView from './participantView';
import LoadingPage from '../LoadingPage';
import QuestionsView from './questionsView';
import { Participant } from '@/types';

const backgroundStyle = css`
  background: ${Variables.colors.surface_default};
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ParticipantsContainer = (shortRadius: number, longRadius: number) => css`
  position: relative;
  width: ${longRadius * 2}px;
  height: ${shortRadius * 2}px;
  border-radius: 50%;
`;

const SubjectContainer = (shortRadius: number, longRadius: number) => css`
  width: 80%;
  position: absolute;
  bottom: ${shortRadius}px;
  left: ${longRadius}px;
  transform: translate(-50%, 20%);
  white-space: nowrap;
`;

const ResultInstructionStyle = css`
  width: 100%;
  font: ${Variables.typography.font_bold_24};
  text-align: center;
`;

interface ParticipantItem {
  id: string;
  nickname: string;
}

const Room = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const { socket, connect, disconnect } = useSocketStore();
  const { hostId, participants, setParticipants, setHostId } = useParticipantsStore();
  const { radius, increaseRadius, increaseLongRadius } = useRadiusStore();

  const [roomExists, setRoomExists] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isIntroViewActive, setIsIntroViewActive] = useState(true);
  const [isResultView, setIsResultView] = useState(true); //결과 페이지인지 여부

  const positions = useMemo(
    () => calculatePosition(Object.keys(participants).length, radius[0], radius[1]),
    [radius, participants]
  );

  const hideIntroView = () => setIsIntroViewActive(false);

  const calculateRadius = (count: number) => {
    if (count > 3) {
      increaseRadius();
    }
  };

  // 참가자 배열을 객체로 변환하는 함수
  const convertArrayToObject = (participantsArray: ParticipantItem[]) => {
    return participantsArray.reduce(
      (acc, participant) => {
        acc[participant.id] = participant;
        return acc;
      },
      {} as { [id: string]: Participant }
    );
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
        (response: { status: string; body: { participants: ParticipantItem[]; hostId: string } }) => {
          setRoomExists(response.status === 'ok');
          if (roomExists) {
            setParticipants(convertArrayToObject(response.body.participants));
            setHostId(response.body.hostId);
            setLoading(false);
          }
          if (socket.id) setCurrentUserId(socket.id);
        }
      );

      // 새로운 참여자 알림 이벤트
      socket.on('participant:join', (newParticipant: { participantId: string; nickname: string }) => {
        setParticipants((prev) => ({
          ...prev,
          [newParticipant.participantId]: {
            id: newParticipant.participantId,
            nickname: newParticipant.nickname
          }
        }));
      });
      return () => {
        socket.disconnect();
      };
    }
  }, [socket, roomId, setParticipants]);

  // 참여자 수가 변경될 때마다 반지름 계산
  useEffect(() => {
    calculateRadius(Object.keys(participants).length);
  }, [participants]);

  useEffect(() => {
    //isResultview가 true가 되면
    if (isResultView) {
      increaseLongRadius();
    }
  }, [isResultView]);

  if (!roomExists) return <RoomNotFoundError />;

  return (
    <>
      {/* <Header /> */}
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div css={backgroundStyle}>
            <div css={ParticipantsContainer(radius[0], radius[1])}>
              {Object.keys(participants).map((participantId, index) => (
                <UserProfile
                  key={participantId}
                  participant={participants[participantId]}
                  index={index}
                  isCurrentUser={participantId === currentUserId}
                  isHost={hostId === participantId}
                  position={{ x: positions[index][0], y: positions[index][1] }}
                  isResultView={isResultView}
                  setIsResultView={setIsResultView}
                />
              ))}
              <div css={SubjectContainer(radius[0], radius[1])}>
                {isResultView ? (
                  <div css={ResultInstructionStyle}>우리가 함께 지닌 공감 포인트들</div>
                ) : (
                  <>
                    {isIntroViewActive &&
                      (hostId === currentUserId ? (
                        <HostView participantCount={Object.keys(participants).length} />
                      ) : (
                        <ParticipantView />
                      ))}
                    <QuestionsView onQuestionStart={hideIntroView} />
                  </>
                )}
              </div>
            </div>
            <ShareButton />
          </div>
          <ParticipantListSidebar />
        </>
      )}
    </>
  );
};

export default Room;
