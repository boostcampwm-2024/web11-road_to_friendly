import { css } from '@emotion/react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

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
import useParticipants from '@/hooks/useParticipants';
import { Header } from '@components/common';
import { ContentShareView } from './content-share';

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
  const [loading, setLoading] = useState<boolean>(true);

  const { participants, hostId, currentUserId, roomExists } = useParticipants(roomId, setLoading);
  const { radius, increaseRadius, increaseLongRadius } = useRadiusStore();

  const [isIntroViewActive, setIsIntroViewActive] = useState(true);
  const [isResultView, setIsResultView] = useState(false); //결과 페이지인지 여부

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
      <Header />
      {loading ? (
        <LoadingPage loadingMessage="관심사를 나누러 가는 중..." />
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
                  <>
                    <ResultInstruction />
                    <ContentShareView />
                  </>
                ) : (
                  <RoomIntroView
                    isIntroViewActive={isIntroViewActive}
                    currentUserId={currentUserId}
                    hostId={hostId}
                    participantCount={Object.keys(participants).length}
                    hideIntroView={hideIntroView}
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
