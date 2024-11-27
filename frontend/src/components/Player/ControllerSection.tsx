import ReactPlayer from 'react-player';
import { Slider } from '../common';
import { useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import ControllBar from './ControllBar';

interface ControllerSectionProps {
  isHovering: boolean;
  player: ReactPlayer;
  isSharer: boolean;
  fraction: number;
  setFraction: (newFraction: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  socket: Socket;
  prevIsPlayingRef: React.MutableRefObject<boolean>;
  volume: number;
  setVolume: (newVolume: number) => void;
  isPlaying: boolean;
  playVideo: () => void;
  pauseVideo: () => void;
}

const ControllerSection = ({
  isHovering,
  player,
  isSharer,
  fraction,
  setFraction,
  setIsPlaying,
  socket,
  prevIsPlayingRef,
  volume,
  setVolume,
  isPlaying,
  playVideo,
  pauseVideo
}: ControllerSectionProps) => {
  const [controllbarHeight, setControllbarHeight] = useState(0);

  const isDraggingSliderRef = useRef(false);
  const hasDragHandledRef = useRef(false);
  const prevVolumeRef = useRef(0);

  function sendDraggingStart() {
    socket?.emit('interest:youtube:dragging');
  }

  function sendTimelineChange(targetTime: number) {
    const playStatus = prevIsPlayingRef.current ? 'play' : 'pause';
    socket?.emit('interest:youtube:timeline', { targetTime, playStatus, clientTimestamp: Date.now() });
  }

  function handleDragStart() {
    hasDragHandledRef.current = true;

    setIsPlaying(false);

    player?.getInternalPlayer().pauseVideo();

    sendDraggingStart();
  }

  function setFractionAndMove(newFraction: number) {
    if (!isSharer || !player) return;

    player.seekTo(newFraction, 'fraction');
    setFraction(newFraction);

    if (isDraggingSliderRef.current && !hasDragHandledRef.current) {
      handleDragStart();
    }

    // 이동 중 임시로 변하는 경우 prevIsPlayingRef를 업데이트 하지 않음
    if (!isDraggingSliderRef.current) {
      const newSec = newFraction * player.getDuration();
      sendTimelineChange(newSec);

      setIsPlaying(prevIsPlayingRef.current);

      if (prevIsPlayingRef.current) {
        player.getInternalPlayer().playVideo();
      } else {
        player.getInternalPlayer().pauseVideo();
      }

      hasDragHandledRef.current = false;
    }
  }

  return (
    <div>
      {isHovering && player && (
        <div>
          <div
            css={{
              position: 'absolute',
              bottom: '0',
              width: '95%',
              height: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: '997'
            }}
          >
            <Slider
              showThumb={isSharer}
              fraction={fraction}
              setFraction={setFractionAndMove}
              bottom={controllbarHeight + 6}
              shouldHoverGrow={true}
              shouldExtendWhenDrag={true}
              shouldThumbAnytime={false}
              onMouseDownStateChange={(isDown: boolean) => {
                isDraggingSliderRef.current = isDown;
              }}
            />
          </div>
          <ControllBar
            isSharer={isSharer}
            player={player}
            currentTime={player.getCurrentTime()}
            duration={player.getDuration()}
            setControllbarHeight={setControllbarHeight}
            volume={volume}
            setVolume={setVolume}
            prevVolumeRef={prevVolumeRef}
            isPlaying={isPlaying}
            playVideo={playVideo}
            pauseVideo={pauseVideo}
          />
        </div>
      )}
    </div>
  );
};

export default ControllerSection;
