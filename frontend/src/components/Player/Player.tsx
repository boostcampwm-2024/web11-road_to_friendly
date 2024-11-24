import { useParticipantsStore, useSocketStore } from '@/stores';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import ProgressBar from './ProgressBar';
import ControllBar from './ControllBar';
import { divideSize, multiplySize } from '@/utils';

type StateChange = 'pause' | 'play';

interface PlayerProps {
  url: string;
}

const wrapperStyle = css({
  position: 'relative'
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
    setFraction(played);
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
          style={{ pointerEvents: 'none', zIndex: '998' }}
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
            sendStateChangeIfHost('play');
          }}
          onProgress={syncFractionWithProgress}
          config={{
            embedOptions: {
              ecver: 2
            }
          }}
        />
        {isHovering && player && (
          <div>
            <ProgressBar
              fraction={fraction}
              setFractionAndMove={setFractionAndMove}
              progressBarBottom={controllbarHeight}
            />
            <ControllBar
              currentTime={Math.floor(player.getCurrentTime())}
              duration={Math.floor(player.getDuration())}
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
