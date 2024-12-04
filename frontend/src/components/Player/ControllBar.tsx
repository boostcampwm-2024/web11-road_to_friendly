import { css } from '@emotion/react';
import { memo, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

import { Slider } from '@/components/common';

import PauseIcon from '@/assets/icons/pause-line.svg?react';
import PlayIcon from '@/assets/icons/play-fill.svg?react';
import SettingFillIcon from '@/assets/icons/settings-4-fill.svg?react';
import VolumeFillIcon from '@/assets/icons/volume-down-fill.svg?react';
import VolumneMuteFillIcon from '@/assets/icons/volume-mute-fill.svg?react';
import { Variables } from '@/styles';
import { convertSecToHHMMSS } from '@/utils';

import SettingPanel from './SettingPanel';

interface ControllBarProps {
  isSharer: boolean;
  player: ReactPlayer;
  setControllbarHeight: React.Dispatch<React.SetStateAction<number>>;
  currentTime: number;
  duration: number;
  volume: number;
  setVolume: (volume: number) => void;
  prevVolumeRef: React.MutableRefObject<number>;
  isPlaying: boolean;
  playVideo: () => void;
  pauseVideo: () => void;
}

interface VolumeBarProps {
  volume: number;
  setVolume: (volume: number) => void;
  controllBarRef: React.MutableRefObject<HTMLDivElement>;
}

interface StateChangeButtonProps {
  isSharer: boolean;
  isPlaying: boolean;
  pauseVideo: () => void;
  playVideo: () => void;
}

interface SettingSectionProps {
  isSharer: boolean;
  controllBarRef: React.MutableRefObject<HTMLDivElement>;
  player: ReactPlayer;
}

const StateChangeButton = memo(({ isSharer, isPlaying, pauseVideo, playVideo }: StateChangeButtonProps) => {
  return (
    <>
      {isSharer && isPlaying && (
        <button onClick={pauseVideo} aria-label="pause button">
          <PauseIcon css={iconStyle} />
        </button>
      )}
      {isSharer && !isPlaying && (
        <button onClick={playVideo} aria-label="play button">
          <PlayIcon css={iconStyle} />
        </button>
      )}
    </>
  );
});

const VolumeBar = memo(({ volume, setVolume, controllBarRef }: VolumeBarProps) => {
  return (
    <div
      css={{
        position: 'relative',
        width: '3rem',
        height: controllBarRef.current ? `${controllBarRef.current.offsetHeight}px` : '100%'
      }}
    >
      <Slider
        fraction={volume}
        setFraction={setVolume}
        bottom={controllBarRef.current ? controllBarRef.current.offsetHeight / 2 : 0}
        shouldExtendAnytime={true}
        color={{ thumb: Variables.colors.surface_white }}
      />
    </div>
  );
});

const SettingSection = memo(({ isSharer, controllBarRef, player }: SettingSectionProps) => {
  const [openSettingPanel, setOpenSettingPanel] = useState(false);
  return (
    <>
      {isSharer && (
        <>
          <button onClick={() => setOpenSettingPanel(!openSettingPanel)} aria-label="setting toggle button">
            <SettingFillIcon css={iconStyle} />
          </button>
          {controllBarRef.current && (
            <SettingPanel
              openSettingPanel={openSettingPanel}
              player={player}
              controllBarHeight={controllBarRef.current.offsetHeight}
            />
          )}
        </>
      )}
    </>
  );
});

const ControllBar = ({
  isSharer,
  player,
  currentTime,
  duration,
  setControllbarHeight,
  volume,
  setVolume,
  prevVolumeRef,
  isPlaying,
  playVideo,
  pauseVideo
}: ControllBarProps) => {
  const controllBarRef = useRef<HTMLDivElement>(null);
  const isMuted = volume === 0;

  useEffect(() => {
    if (!controllBarRef.current) return;
    setControllbarHeight(controllBarRef.current.offsetHeight);
  }, []);

  function toggleVolume() {
    if (isMuted) setVolume(prevVolumeRef.current);
    else {
      prevVolumeRef.current = volume;
      setVolume(0);
    }
  }

  const VolumeIcon = isMuted ? VolumneMuteFillIcon : VolumeFillIcon;

  return (
    <>
      <div css={controllBarBackgroundStyle}> </div>
      <div
        css={
          controllBarRef.current
            ? controllBarStyle(`${controllBarRef.current.offsetHeight}px`)
            : controllBarStyle('fit-content')
        }
        ref={controllBarRef}
        onDrag={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div css={leftSectionStyle}>
          <StateChangeButton isSharer={isSharer} isPlaying={isPlaying} pauseVideo={pauseVideo} playVideo={playVideo} />
          <div css={volumeContainerStyle}>
            <button onClick={toggleVolume} aria-label="volume toggle button">
              <VolumeIcon css={iconStyle} />
            </button>
            <VolumeBar volume={volume} setVolume={setVolume} controllBarRef={controllBarRef} />
          </div>
          <div css={timeSectionStyle}>
            {convertSecToHHMMSS(Math.round(currentTime))} / {convertSecToHHMMSS(Math.round(duration))}
          </div>
        </div>
        <div css={rightSectionStyle}>
          <SettingSection isSharer={isSharer} controllBarRef={controllBarRef} player={player} />
        </div>
      </div>
    </>
  );
};

const controllBarBackgroundStyle = css({
  position: 'absolute',
  bottom: '0',

  background: `linear-gradient(to bottom, transparent, ${Variables.colors.surface_transparent_black_50} 85%)`,
  width: '100%',
  height: '4rem',
  zIndex: '996',
  pointerEvents: 'none'
});

const controllBarStyle = (height: string) =>
  css({
    position: 'absolute',
    bottom: '0',

    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.25rem 2rem 0.65rem 2rem',

    width: '100%',
    height: height,
    zIndex: '998',

    button: {
      display: 'flex',
      alignItems: 'center'
    }
  });

const leftSectionStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2rem'
});

const rightSectionStyle = css({ display: 'flex', gap: '2rem', alignItems: 'center' });

const timeSectionStyle = css({ color: Variables.colors.text_white, font: Variables.typography.font_light_14 });

const iconStyle = css({
  fill: Variables.colors.text_white,
  width: '1.25rem',
  height: '1.25rem',

  cursor: 'pointer'
});

const volumeContainerStyle = css({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  cursor: 'pointer',
  height: '100%'
});

export default ControllBar;
