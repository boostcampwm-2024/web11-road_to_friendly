import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

import StopIcon from '@/assets/icons/stop.svg?react';
import { useParticipantsStore, useSocketStore } from '@/stores';
import { flexStyle, Variables } from '@/styles';
import { Content } from '@/types';

import { ContentPresentSection, WaitingListEmpty, WaitingListInfo } from './index';

const ContentShareViewStyle = css([
  {
    position: 'relative',
    width: '50vw',
    height: '60vh',
    padding: '24px',
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
  const { socket } = useSocketStore();
  const { hostId } = useParticipantsStore();
  const [currentContent, setCurrentContent] = useState<Content | null>({ sharerSocketId: '' });
  const [numberOfWaiters, setNumberOfWaiters] = useState(0);

  // const isHostOrSharer = currentContent?.sharerSocketId === socket?.id || socket?.id === hostId;
  const isHostOrSharer = true;

  useEffect(() => {
    const fetchNumberOfWaiters = () => {
      if (socket && socket.connected) {
        socket.on('share:interest:add', (response: { nowQueueSize: number }) => {
          setNumberOfWaiters(response.nowQueueSize);
        });
      }
    };

    fetchNumberOfWaiters();
  }, [socket]);

  return (
    <section css={ContentShareViewStyle}>
      {currentContent === null ? (
        <WaitingListEmpty />
      ) : (
        <>
          <WaitingListInfo numWaiting={numberOfWaiters} />
          <ContentPresentSection content={currentContent} />
          {isHostOrSharer && (
            <button css={StopShareButtonStyle}>
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
