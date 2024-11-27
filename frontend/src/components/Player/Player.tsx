import { useSocketStore } from '@/stores';
import { css, keyframes } from '@emotion/react';
import { useRef, useState } from 'react';
import { divideSize, multiplySize } from '@/utils';
import { Variables } from '@/styles';
import ReactPlayer from 'react-player';
import PlayIcon from '@/assets/icons/play-fill.svg?react';
import PauseIcon from '@/assets/icons/pause-line.svg?react';
import { useFraction, useToast } from '@/hooks';
import { InterestYoutubeResponse, YoutubeRequestType } from '@/types';
import { YOUTUBE_ERROR_MESSAGES } from '@/constants';
import SharerDraggingIndicator from './SharerDraggingIndicator';
import ControllerSection from './ControllerSection';

type StateChange = 'pause' | 'play';

interface PlayerProps {
  url: string;
  isSharer: boolean;
  isShorts: boolean;
}

// 기본 플레이어의 비율은 16:9 비율
const PLAYER_WIDTH_DEFAULT = '40rem';
const PLAYER_HEIGHT_DEFAULT = divideSize(PLAYER_WIDTH_DEFAULT, 16 / 9);
const PLAYER_HEIGHT_DOUBLE = multiplySize(PLAYER_HEIGHT_DEFAULT, 2);

const statusEventNameMap: Record<StateChange, string> = {
  play: 'interest:youtube:play',
  pause: 'interest:youtube:stop'
};

const wrapperStyle = css({
  position: 'relative',
  width: PLAYER_WIDTH_DEFAULT,
  height: PLAYER_HEIGHT_DEFAULT,
  overflow: 'hidden',
  borderRadius: '1rem'
});

const mediaSectionStyle = css({
  position: 'absolute',
  zIndex: '998',
  top: '0',
  width: '100%',
  height: '80%'
});

const growAndDiplay = (baseTransform: string) =>
  keyframes({
    '0%': {
      opacity: '0',
      transform: `${baseTransform} scale(0)`
    },
    '48%': {
      opacity: '1',
      transform: `${baseTransform} scale(1)`
    },
    '60%': {
      opacity: '0.3',
      transform: `${baseTransform} scale(1.4)`
    },
    '100%': {
      opacity: '0',
      transform: `${baseTransform} scale(2)`
    }
  });

const stateChangeIndicatorStyle = (stateChanged: boolean) =>
  css({
    position: 'absolute',
    top: '50%',
    left: '50%',
    opacity: '0',
    animation: stateChanged ? `${growAndDiplay('translate(-50%, -50%)')} 0.5s ease-out` : '',
    fill: Variables.colors.surface_white,
    width: '3rem',
    zIndex: '999'
  });

const Player = ({ url, isSharer, isShorts }: PlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [player, setPlayer] = useState<ReactPlayer | null>(null);
  const [fraction, setFraction] = useFraction(0);
  const [isHovering, setIsHovering] = useState(false);
  const [volume, setVolume] = useFraction(0);
  const [isSharerDragging, setIsSharerDragging] = useState(false);

  const prevPlayedSecRef = useRef(0);
  const prevIsPlayingRef = useRef(false);
  const hasEndedRef = useRef(false);

  const isDraggingSliderRef = useRef(false);

  const { socket } = useSocketStore();
  const { openToast } = useToast();

  const requestFunctionMap: Record<YoutubeRequestType, Function> = {
    PLAY: syncWithSharerPlayOrPause,
    STOP: syncWithSharerPlayOrPause,
    TIMELINE: syncWithSharerTimelineChange,
    SPEED: syncWithSharerSpeedChange,
    DRAGGING: syncWithSharerDragStart
  };

  function playVideo() {
    if (!isSharer) return;
    prevIsPlayingRef.current = true;

    setIsPlaying(true);
    player?.getInternalPlayer().playVideo();

    sendStateChange('play');
  }

  function pauseVideo() {
    if (!isSharer) return;
    prevIsPlayingRef.current = false;

    setIsPlaying(false);

    player?.getInternalPlayer().pauseVideo();

    sendStateChange('pause');
  }

  function toggleVideo() {
    if (isPlaying) pauseVideo();
    else playVideo();
  }

  function syncWithSharerPlayOrPause({
    requestType,
    videoCurrentTime
  }: {
    requestType: 'PLAY' | 'STOP';
    videoCurrentTime: number;
  }) {
    if (!player) throw new Error(YOUTUBE_ERROR_MESSAGES.NO_PLAYER);

    player.seekTo(videoCurrentTime, 'seconds');
    if (requestType === 'PLAY') {
      setIsPlaying(true);
      player.getInternalPlayer().playVideo();
    } else {
      setIsPlaying(false);

      player.getInternalPlayer().pauseVideo();
    }
  }

  function syncWithSharerTimelineChange({
    targetTime,
    playStatus
  }: {
    targetTime: number;
    playStatus: 'play' | 'pause';
  }) {
    if (!player) throw new Error(YOUTUBE_ERROR_MESSAGES.NO_PLAYER);

    const sharerIsPlaying = playStatus === 'play';

    player.getInternalPlayer().playVideo();

    player.seekTo(targetTime, 'seconds');
    if (sharerIsPlaying) {
      player.getInternalPlayer().playVideo();
    } else {
      player.getInternalPlayer().pauseVideo();
    }
    setIsPlaying(sharerIsPlaying);
    setIsSharerDragging(false);
  }

  function syncWithSharerSpeedChange({ playSpeed }: { playSpeed: number }) {
    if (!player) throw new Error(YOUTUBE_ERROR_MESSAGES.NO_PLAYER);

    player.getInternalPlayer().setPlaybackRate(playSpeed);
  }

  function syncWithSharerDragStart() {
    if (!player) throw new Error(YOUTUBE_ERROR_MESSAGES.NO_PLAYER);

    setIsPlaying(false);

    player.getInternalPlayer().pauseVideo();

    setIsSharerDragging(true);
  }

  function attachPlayerEvent() {
    if (!socket) return;

    socket.on('share:interest:youtube', (response: InterestYoutubeResponse) => {
      if (isSharer) return;
      try {
        requestFunctionMap[response.requestType](response);
      } catch (error) {
        if (error instanceof Error) openToast({ text: error.message, type: 'error' });
      }
    });
  }

  function sendStateChange(stateChange: StateChange) {
    const eventName = statusEventNameMap[stateChange];
    const body: Record<string, any> = { videoCurrentTime: player?.getCurrentTime(), playStatus: stateChange };

    if (stateChange === 'play') body['clientTimestamp'] = Date.now();
    socket?.emit(eventName, body);
  }

  function syncFractionWithProgress({ played }: { played: number }) {
    if (hasEndedRef.current) return;
    setFraction(played);
  }

  function onProgressWithReqeustAnimation(callback: Function) {
    if (!isPlaying || !player || hasEndedRef.current) return;

    const playedSec = player.getCurrentTime();
    const duration = player.getDuration();

    if (duration) {
      const played = playedSec / duration;

      if (playedSec !== prevPlayedSecRef.current) {
        callback({ played });
      }

      prevPlayedSecRef.current = playedSec;
    }

    requestAnimationFrame(() => onProgressWithReqeustAnimation(callback));
  }

  return (
    <>
      <div
        css={wrapperStyle}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onDragStartCapture={(e) => {
          e.preventDefault();
        }}
        aria-label="player section"
      >
        {!isDraggingSliderRef.current && (
          <div
            css={mediaSectionStyle}
            onClick={toggleVideo}
            onDrag={(e) => {
              e.preventDefault();
            }}
          ></div>
        )}

        {isPlaying ? (
          <PlayIcon css={stateChangeIndicatorStyle(prevIsPlayingRef.current === isPlaying)} />
        ) : (
          <PauseIcon css={stateChangeIndicatorStyle(prevIsPlayingRef.current === isPlaying)} />
        )}

        <ReactPlayer
          style={{
            pointerEvents: 'none',
            zIndex: '996',
            position: 'relative',
            transform: isShorts ? 'none' : 'translateY(-25%)'
          }}
          height={isShorts ? '100%' : PLAYER_HEIGHT_DOUBLE}
          onReady={attachPlayerEvent}
          controls={false}
          volume={volume}
          url={url}
          ref={(player) => setPlayer(player)}
          onPlay={() => {
            hasEndedRef.current = false;
            onProgressWithReqeustAnimation(syncFractionWithProgress);
          }}
          onEnded={() => {
            if (isDraggingSliderRef.current) return;
            syncFractionWithProgress({ played: 1 });
            hasEndedRef.current = true;
            pauseVideo();
          }}
          config={{ youtube: { playerVars: { autoplay: 1 } } }}
        />
        <SharerDraggingIndicator isSharerDragging={isSharerDragging} />
        <ControllerSection
          isHovering={isHovering}
          player={player}
          isSharer={isSharer}
          isPlaying={isPlaying}
          playVideo={playVideo}
          pauseVideo={pauseVideo}
          setFraction={setFraction}
          setVolume={setVolume}
          volume={volume}
          socket={socket}
          fraction={fraction}
          setIsPlaying={setIsPlaying}
          prevIsPlayingRef={prevIsPlayingRef}
        />
      </div>
    </>
  );
};

export default Player;
