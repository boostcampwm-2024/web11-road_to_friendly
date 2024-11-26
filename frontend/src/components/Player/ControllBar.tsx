import { Variables } from '@/styles';
import { css } from '@emotion/react';

import PlayIcon from '@/assets/icons/play-fill.svg?react';
import PauseIcon from '@/assets/icons/pause-line.svg?react';
import VolumeFillIcon from '@/assets/icons/volume-down-fill.svg?react';
import VolumneMuteFillIcon from '@/assets/icons/volume-mute-fill.svg?react';

import SettingFillIcon from '@/assets/icons/settings-4-fill.svg?react';

import { useEffect, useRef, useState } from 'react';
import { Slider } from '@/components/common';
import SettingPanel from './SettingPanel';
import ReactPlayer from 'react-player';

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
    zIndex: '998'
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

function convertSecToHHMMSS(sec: number, minParts: number = 2) {
  const hour = Math.floor(sec / 3600);
  const minute = Math.floor((sec % 3600) / 60);
  const second = sec % 60;

  const HHMMSSArray = [hour, minute, second].map((val: number) => (val < 10 ? `0${val}` : `${val}`));

  let isPrevExist = false;
  const filteredParts = HHMMSSArray.filter((part: string, idx: number) => {
    if (isPrevExist || Number(part) > 0 || HHMMSSArray.length - idx <= minParts) {
      isPrevExist = true;
      return true;
    }
    return false;
  });

  return filteredParts.join(':');
}

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
  const [openSettingPanel, setOpenSettingPanel] = useState(false);
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
          {isSharer && isPlaying && <PauseIcon css={iconStyle} onClick={pauseVideo} />}
          {isSharer && !isPlaying && <PlayIcon css={iconStyle} onClick={playVideo} />}
          <div css={volumeContainerStyle}>
            <VolumeIcon css={iconStyle} onClick={toggleVolume} />
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
          </div>

          <div css={timeSectionStyle}>
            {convertSecToHHMMSS(Math.round(currentTime))} / {convertSecToHHMMSS(Math.round(duration))}
          </div>
        </div>
        <div css={rightSectionStyle}>
          {isSharer && (
            <>
              <SettingFillIcon css={iconStyle} onClick={() => setOpenSettingPanel(!openSettingPanel)} />
              {controllBarRef.current && (
                <SettingPanel
                  openSettingPanel={openSettingPanel}
                  player={player}
                  controllBarHeight={controllBarRef.current.offsetHeight}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ControllBar;
