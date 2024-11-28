import { css } from '@emotion/react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import useParticipants from '@/hooks/useParticipants';

import { Header } from '@/components/common';
import ParticipantListSidebar from '@/components/ParticipantListSidebar';
import RoomNotFoundError from '@/components/RoomNotFound';
import UserProfile from '@/components/UserProfile';

import { ShareButton } from '@/components';
import { useRadiusStore } from '@/stores/';
import { Variables } from '@/styles/Variables';
import { calculatePosition } from '@/utils';

import LoadingPage from '../LoadingPage';
import ResultInstruction from './resultInstruction';
import RoomIntroView from './roomIntroView';

const backgroundStyle = css`
  background: ${Variables.colors.surface_default};
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 100px; /* 헤더 높이를 고려한 여백 추가 */
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
  transform: translate(-50%, 50%);
  white-space: nowrap;
`;

const Room = () => {
  const roomId = useParams<{ roomId: string }>().roomId || null;
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [resultLoading, setResultLoading] = useState<boolean>(false);

  const { participants, hostId, currentUserId, roomExists } = useParticipants(roomId, setInitialLoading);
  const { radius, increaseRadius, increaseLongRadius } = useRadiusStore();
  const { setOutOfBounds } = useRadiusStore();

  const [isIntroViewActive, setIsIntroViewActive] = useState(true);
  const [isResultView, setIsResultView] = useState(false); //결과 페이지 여부

  const startResultPage = () => {
    setIsResultView(true);
  };

  const startResultLoading = () => {
    setResultLoading(true);
  };

  const finishResultLoading = () => {
    setResultLoading(false);
  };

  const positions = useMemo(
    () => calculatePosition(Math.min(Object.keys(participants).length, 8), radius[0], radius[1]), //10명으로 제한
    [radius, participants]
  );

  const hideIntroView = () => {
    setIsIntroViewActive(false);
    setOutOfBounds(true);
  };

  const calculateRadius = (count: number) => {
    if (count > 3) {
      increaseRadius();
    }
  };

  // 참여자 수가 변경될 때마다 반지름 계산
  useEffect(() => {
    calculateRadius(Object.keys(participants).length);
  }, [participants]);

  useEffect(() => {
    if (isResultView) {
      increaseLongRadius();
    }
  }, [isResultView]);

  if (!roomExists) return <RoomNotFoundError />;

  return (
    <>
      <Header />
      {initialLoading ? (
        <LoadingPage loadingMessage="관심사를 나누러 가는 중..." />
      ) : (
        <>
          <div css={backgroundStyle}>
            <div css={ParticipantsContainer(radius[0], radius[1])}>
              {Object.keys(participants).map((participantId, index) => {
                const position = positions[index];
                if (!position) return null;
                return (
                  <UserProfile
                    key={participantId}
                    participant={participants[participantId]}
                    index={index}
                    isCurrentUser={participantId === currentUserId}
                    isHost={hostId === participantId}
                    position={{ x: positions[index][0], y: positions[index][1] }}
                    isResultView={isResultView}
                  />
                );
              })}
              <div css={SubjectContainer(radius[0], radius[1])}>
                {isResultView ? (
                  resultLoading ? (
                    <LoadingPage isAnalyzing={true} />
                  ) : (
                    <>
                      <ResultInstruction />
                      <ContentShareView />
                    </>
                  )
                ) : (
                  <RoomIntroView
                    isIntroViewActive={isIntroViewActive}
                    currentUserId={currentUserId}
                    hostId={hostId}
                    participantCount={Object.keys(participants).length}
                    hideIntroView={hideIntroView}
                    resultLoading={resultLoading}
                    onLastQuestionComplete={startResultPage}
                    startResultLoading={startResultLoading}
                    finishResultLoading={finishResultLoading}
                  />
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
