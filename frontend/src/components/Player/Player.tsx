import { css } from '@emotion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

import { YOUTUBE_ERROR_MESSAGES } from '@/constants/youtube';
import { useFraction, useToast } from '@/hooks';
import { useSocketStore } from '@/stores';
import { InterestYoutubeResponse, PlayerState, YoutubeRequestType } from '@/types';
import { divideSize, multiplySize } from '@/utils';

import ControllerSection from './ControllerSection';
import SharerDraggingIndicator from './SharerDraggingIndicator';
import StateChangeIndicator from './StateChangeIndicator';
import VideoOverlayToggle from './VideoOverlayToggle';

interface PlayerProps {
  url: string;
  isSharer: boolean;
  isShorts: boolean;
  prevVolumeRef?: React.MutableRefObject<number | null>;
}

// 기본 플레이어의 비율은 16:9 비율
const PLAYER_WIDTH_DEFAULT = '40rem';
const PLAYER_HEIGHT_DEFAULT = divideSize(PLAYER_WIDTH_DEFAULT, 16 / 9);
const PLAYER_HEIGHT_DOUBLE = multiplySize(PLAYER_HEIGHT_DEFAULT, 2);

const statusEventNameMap: Record<PlayerState, string> = {
  play: 'interest:youtube:play',
  pause: 'interest:youtube:stop'
};

const Player = ({ url, isSharer, isShorts, prevVolumeRef }: PlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [player, setPlayer] = useState<ReactPlayer | null>(null);
  const [fraction, setFraction] = useFraction(0);
  const [isHovering, setIsHovering] = useState(false);
  const [volume, setVolume] = useFraction(prevVolumeRef?.current ?? 0);
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

  const sendPlayerState = useCallback(
    (stateChange: PlayerState) => {
      const eventName = statusEventNameMap[stateChange];
      const body: Record<string, any> = { videoCurrentTime: player?.getCurrentTime(), playStatus: stateChange };

      if (stateChange === 'play') body['clientTimestamp'] = Date.now();
      socket?.emit(eventName, body);
    },
    [player, socket]
  );

  const playVideoAsSharer = useCallback(() => {
    if (!isSharer) return;
    prevIsPlayingRef.current = true;

    setIsPlaying(true);
    player?.getInternalPlayer().playVideo();

    sendPlayerState('play');
  }, [isSharer, player, sendPlayerState]);

  const pauseVideoAsSharer = useCallback(() => {
    if (!isSharer) return;
    prevIsPlayingRef.current = false;

    setIsPlaying(false);
    player?.getInternalPlayer().pauseVideo();

    sendPlayerState('pause');
  }, [isSharer, player, sendPlayerState]);

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

  const sharerControlFunctions = useMemo(
    () => ({
      playVideoAsSharer,
      pauseVideoAsSharer
    }),
    [playVideoAsSharer, pauseVideoAsSharer]
  );

  useEffect(() => {
    return () => {
      if (prevVolumeRef !== undefined) prevVolumeRef.current = volume;
    };
  }, [volume]);

  useEffect(() => {
    return () => {
      socket?.off('share:interest:youtube');
    };
  }, []);

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
          <VideoOverlayToggle isPlaying={isPlaying} sharerControlFunctions={sharerControlFunctions} />
        )}
        {!isDraggingSliderRef.current && (
          <StateChangeIndicator isPlaying={isPlaying} prevIsPlayingRef={prevIsPlayingRef} />
        )}
        <SharerDraggingIndicator isSharerDragging={isSharerDragging} />
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
            pauseVideoAsSharer();
          }}
          config={{ youtube: { playerVars: { autoplay: 1 } } }}
        />
        {isHovering && player && (
          <ControllerSection
            isHovering={isHovering}
            player={player}
            isSharer={isSharer}
            isPlaying={isPlaying}
            sharerControlFunctions={sharerControlFunctions}
            setFraction={setFraction}
            setVolume={setVolume}
            volume={volume}
            socket={socket}
            fraction={fraction}
            setIsPlaying={setIsPlaying}
            prevIsPlayingRef={prevIsPlayingRef}
            isDraggingSliderRef={isDraggingSliderRef}
          />
        )}
      </div>
    </>
  );
};

const wrapperStyle = css({
  position: 'relative',
  width: PLAYER_WIDTH_DEFAULT,
  height: PLAYER_HEIGHT_DEFAULT,
  overflow: 'hidden',
  borderRadius: '1rem',
  userSelect: 'none'
});

export default Player;
