import { useParticipantsStore, useSocketStore } from '@/stores';
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import ControllBar from './ControllBar';
import { divideSize, multiplySize } from '@/utils';
import { Slider } from '@components/common';

type StateChange = 'pause' | 'play';

interface PlayerProps {
  url: string;
}

// 기본 플레이어의 비율은 16:9 비율
const PLAYER_WIDTH_DEFAULT = '40rem';
const PLAYER_HEIGHT_DEFAULT = divideSize(PLAYER_WIDTH_DEFAULT, 16 / 9);
const PLAYER_HEIGHT_DOUBLE = multiplySize(PLAYER_HEIGHT_DEFAULT, 2);

const wrapperStyle = css({
  position: 'relative',
  width: PLAYER_WIDTH_DEFAULT,
  height: PLAYER_HEIGHT_DEFAULT,
  overflow: 'hidden'
});

const Player = ({ url }: PlayerProps) => {
  const { socket, connect } = useSocketStore();
  const { hostId } = useParticipantsStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<ReactPlayer | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [fraction, setFraction] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [volume, setVolume] = useState(0);
  const [controllbarHeight, setControllbarHeight] = useState(0);

  const prevPlayedSecRef = useRef(0);
  const hasEndedRef = useRef(false);

  function playVideo() {
    setIsPlaying(true);
  }

  function pauseVideo() {
    setIsPlaying(false);
  }

  function attachPlayerEvent() {
    /*
    TODO: 플레이어가 준비된 이후부터 이벤트를 받아야 하므로, 이곳에 서버와 연결하는 코드 추가 필요
    */
  }

  function sendStateChangeIfHost(stateChange: StateChange) {
    if (!isHost) return;

    socket?.emit(stateChange, { second: player?.getCurrentTime() });
  }

  function syncFractionWithProgress({ played }: { played: number }) {
    if (hasEndedRef.current) return;
    setFraction(played);
  }

  function onProgressWithReqeustAnimation(callback: Function) {
    if (!(isPlaying && player && !hasEndedRef.current)) return;

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

  function setFractionAndMove(newFraction: number) {
    player?.seekTo(newFraction, 'fraction');
    setFraction(newFraction);
    if (!isPlaying) setIsPlaying(true);
  }

  useEffect(() => {
    if (!socket) connect();
    const currentUserId = socket?.id || '';
    setIsHost(currentUserId === hostId);
  }, [socket]);

  return (
    <>
      <div css={wrapperStyle} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        <ReactPlayer
          style={{ pointerEvents: 'none', zIndex: '998', position: 'relative', transform: 'translateY(-25%)' }}
          height={PLAYER_HEIGHT_DOUBLE}
          playing={isPlaying}
          onReady={attachPlayerEvent}
          controls={false}
          volume={volume}
          url={url}
          ref={(player) => setPlayer(player)}
          onPause={() => {
            sendStateChangeIfHost('pause');
          }}
          onPlay={() => {
            hasEndedRef.current = false;
            onProgressWithReqeustAnimation(syncFractionWithProgress);
            sendStateChangeIfHost('play');
          }}
          onEnded={() => {
            syncFractionWithProgress({ played: 1 });
            hasEndedRef.current = true;
            setIsPlaying(false);
          }}
        />
        {isHovering && player && (
          <div>
            <Slider
              fraction={fraction}
              setFraction={setFractionAndMove}
              bottom={controllbarHeight}
              shouldHoverGrow={true}
              shouldExtendWhenDrag={true}
            />
            <ControllBar
              currentTime={player.getCurrentTime()}
              duration={player.getDuration()}
              setControllbarHeight={setControllbarHeight}
              volume={volume}
              setVolume={setVolume}
              isPlaying={isPlaying}
              playVideo={playVideo}
              pauseVideo={pauseVideo}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Player;
