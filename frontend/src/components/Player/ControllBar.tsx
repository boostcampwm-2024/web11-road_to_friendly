import { Variables } from '@/styles';
import { css } from '@emotion/react';

import PlayIcon from '@/assets/icons/play-fill.svg?react';
import PauseIcon from '@/assets/icons/pause-line.svg?react';
import VolumeFillIcon from '@/assets/icons/volume-down-fill.svg?react';

import CCFillIcon from '@/assets/icons/closed-captioning-fill.svg?react';
import SettingFillIcon from '@/assets/icons/settings-4-fill.svg?react';

import { useEffect, useRef } from 'react';

interface ControllBarProps {
  setControllbarHeight: React.Dispatch<React.SetStateAction<number>>;
  currentTime: number;
  duration: number;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  playVideo: () => void;
  pauseVideo: () => void;
}

const controllBarStyle = css({
  position: 'absolute',
  bottom: '0',

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.275rem 2rem',

  width: '100%',
  backgroundColor: Variables.colors.surface_strong,
  zIndex: '998'
});

const leftSectionStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2rem'
});
const rightSectionStyle = css({ display: 'flex', gap: '2rem', alignItems: 'center' });

const timeSectionStyle = css({ color: Variables.colors.text_white, font: Variables.typography.font_medium_16 });

const iconStyle = css({
  fill: Variables.colors.text_white,
  width: '1.25rem',
  height: '1.25rem',

  cursor: 'pointer'
});

const volumeContainerStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
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
  currentTime,
  duration,
  setControllbarHeight,
  volume,
  setVolume,
  isPlaying,
  playVideo,
  pauseVideo
}: ControllBarProps) => {
  const controllBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!controllBarRef.current) return;
    setControllbarHeight(controllBarRef.current.offsetHeight);
  }, []);

  return (
    <div css={controllBarStyle} ref={controllBarRef}>
      <div css={leftSectionStyle}>
        {isPlaying ? (
          <PauseIcon css={iconStyle} onClick={pauseVideo} />
        ) : (
          <PlayIcon css={iconStyle} onClick={playVideo} />
        )}
        <div css={volumeContainerStyle}>
          <VolumeFillIcon css={iconStyle} />
        </div>

        <div css={timeSectionStyle}>
          {convertSecToHHMMSS(Math.round(currentTime))} / {convertSecToHHMMSS(Math.round(duration))}
        </div>
      </div>
      <div css={rightSectionStyle}>
        <CCFillIcon css={iconStyle} />
        <SettingFillIcon css={iconStyle} />
      </div>
    </div>
  );
};

export default ControllBar;
