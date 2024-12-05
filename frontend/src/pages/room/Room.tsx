import { css } from '@emotion/react';
import { useEffect, useMemo, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { useBeforeUnload, useParams } from 'react-router-dom';

import useParticipants from '@/hooks/useParticipants';

import { Header } from '@/components/common';
import ParticipantListSidebar from '@/components/ParticipantListSidebar';
import UserProfile from '@/components/UserProfile';

import { ShareButton } from '@/components';
import { roomError } from '@/constants/roomError';
import { useCheckRoomAccess, useLoadingState, useViewState } from '@/hooks';
import { useRadiusStore } from '@/stores/';
import { Variables } from '@/styles/variables';
import { calculatePosition } from '@/utils';

import LoadingPage from '../LoadingPage';
import { ContentShareView } from './content-share';
import ResultInstruction from './ResultInstruction';
import RoomCatchWrapper from './RoomCatchWrapper';
import RoomIntroView from './RoomIntroView';

const Room = () => {
  const { showBoundary } = useErrorBoundary();
  const roomId = useParams<{ roomId: string }>().roomId || null;
  const { initialLoading, resultLoading, startResultLoading, finishResultLoading, finishInitialLoading } =
    useLoadingState();
  const {
    isIntroViewActive,
    isResultView,
    isResultInstructionVisible,
    isFadingOut,
    isContentShareVisible,
    startResultPage,
    endIntroView
  } = useViewState();

  const { participants, hostId, currentUserId, roomExists } = useParticipants(roomId, finishInitialLoading);
  const { radius, increaseRadius, increaseLongRadius, setOutOfBounds } = useRadiusStore();
  useCheckRoomAccess();

  useBeforeUnload((e) => {
    if (!isIntroViewActive) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  const positions = useMemo(
    () => calculatePosition(Math.min(Object.keys(participants).length, 8), radius[0], radius[1]), //10명으로 제한
    [radius, participants]
  );

  const hideIntroView = () => {
    endIntroView();
    setOutOfBounds(true);
  };

  const calculateRadius = (count: number) => {
    if (count > 3) {
      increaseRadius();
    }
  };

  const participantElements = useMemo(
    () =>
      Object.keys(participants).map((participantId) => {
        const index = participants[participantId]?.index || 0;
        const position = positions[index];

        return position ? (
          <UserProfile
            key={participantId}
            participant={participants[participantId]}
            isCurrentUser={participantId === currentUserId}
            isHost={hostId === participantId}
            position={{ x: position[0], y: position[1] }}
            isResultView={isResultView}
          />
        ) : null;
      }),
    [participants, positions, currentUserId, hostId, isResultView]
  );

  // 참여자 수가 변경될 때마다 반지름 계산
  useEffect(() => {
    calculateRadius(Object.keys(participants).length);
  }, [participants]);

  useEffect(() => {
    if (isResultView) {
      increaseLongRadius();
    }
  }, [isResultView]);

  if (!roomExists) showBoundary(new Error(roomError.RoomNotFound));

  return (
    <>
      <Header />
      {initialLoading ? (
        <LoadingPage loadingMessage="관심사를 나누러 가는 중..." />
      ) : (
        <>
          <div css={backgroundStyle}>
            <div css={ParticipantsContainer(radius[0], radius[1])}>
              {participantElements}
              <div css={SubjectContainer(radius[0], radius[1])}>
                {isResultView ? (
                  resultLoading ? (
                    <LoadingPage isAnalyzing={true} />
                  ) : (
                    <>
                      {isResultInstructionVisible && <ResultInstruction isFadingOut={isFadingOut} />}
                      {isContentShareVisible && <ContentShareView />}
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
            {isIntroViewActive && <ShareButton />}
          </div>
          <ParticipantListSidebar currentUserId={currentUserId} />
        </>
      )}
    </>
  );
};

const RoomWithCatch = () => {
  return (
    <RoomCatchWrapper>
      <Room />
    </RoomCatchWrapper>
  );
};

export default RoomWithCatch;

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
  display: flex;
  flex-direction: column;
  align-items: center;
`;
