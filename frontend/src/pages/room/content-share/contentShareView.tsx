import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

import StopIcon from '@/assets/icons/stop.svg?react';
import { useToast } from '@/hooks';
import { sendShareStopRequest } from '@/services';
import { useParticipantsStore, useSocketStore } from '@/stores';
import { flexStyle, Variables } from '@/styles';
import { Content, NextContentResponse, WaitingQueueResponse } from '@/types';

import { ContentPresentSection, WaitingListEmpty, WaitingListInfo } from './index';

const ContentShareViewStyle = css([
  {
    position: 'relative',
    width: '40rem',
    height: '28.5625rem',
    backgroundColor: Variables.colors.surface_white,
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='24' ry='24' stroke='%23B5B7BFFF' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='3' stroke-linecap='square'/%3e%3c/svg%3e")`,
    borderRadius: 24
  },
  flexStyle(16, 'column')
]);

const StopShareButtonStyle = css([
  flexStyle(8, 'row', 'space-evenly'),
  {
    backgroundColor: '#FF7275',
    color: Variables.colors.text_white,
    font: Variables.typography.font_bold_16,
    padding: '6px 12px',
    backgroundImage: 'none',
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    position: 'absolute',
    bottom: 0,
    transform: 'translateY(50%)',
    '&:hover': {
      opacity: 0.9
    }
  }
]);

const ContentShareView = () => {
  const { socket, connect } = useSocketStore();
  const { openToast } = useToast();
  const { hostId } = useParticipantsStore();
  const [currentContent, setCurrentContent] = useState<Content | null>(null);
  const [numberOfWaiters, setNumberOfWaiters] = useState(0);

  const stopSharing = async () => {
    try {
      await sendShareStopRequest(socket);
      openToast({ text: '컨텐츠 공유를 중지했어요!', type: 'check' });
    } catch (error) {
      if (error instanceof Error) openToast({ text: error.message, type: 'error' });
    }
  };

  const isHostOrSharer =
    currentContent && socket ? currentContent.sharerSocketId === socket.id || socket.id === hostId : false;

  useEffect(() => {
    if (socket) {
      socket.on('share:interest:broadcast', (response: NextContentResponse) => {
        if (!response.resourceUrl) {
          setCurrentContent(null);
          setNumberOfWaiters(0);
          return;
        }

        setCurrentContent({
          sharerSocketId: response.participantId,
          type: response.resourceType,
          resourceURL: response.resourceUrl
        });

        setNumberOfWaiters(response.nowQueueSize);
      });

      socket.on('share:interest:add', (response: WaitingQueueResponse) => setNumberOfWaiters(response.nowQueueSize));
    } else {
      connect();
    }

    return () => {
      if (socket) {
        socket.off('share:interest:broadcast');
        socket.off('share:interest:add');
      }
    };
  }, [socket, connect]);

  return (
    <section css={ContentShareViewStyle} style={{ padding: currentContent === null ? '4.5rem 3.75rem' : '1.5rem' }}>
      {currentContent === null ? (
        <WaitingListEmpty />
      ) : (
        <>
          <WaitingListInfo numWaiting={numberOfWaiters} />
          <ContentPresentSection content={currentContent} />
          {isHostOrSharer && (
            <button css={StopShareButtonStyle} onClick={stopSharing}>
              <StopIcon fill={Variables.colors.text_white} />
              <span>공유 중지</span>
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default ContentShareView;
