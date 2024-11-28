import PlayIcon from '@/assets/icons/play-fill.svg?react';
import PauseIcon from '@/assets/icons/pause-line.svg?react';
import { css } from '@emotion/react';
import { growAndDiplay, Variables } from '@/styles';

interface StateChangeIndicatorProps {
  isPlaying: boolean;
  prevIsPlayingRef: React.MutableRefObject<boolean>;
}

const StateChangeIndicator = ({ isPlaying, prevIsPlayingRef }: StateChangeIndicatorProps) => {
  return isPlaying ? (
    <PlayIcon css={stateChangeIndicatorStyle(prevIsPlayingRef.current === isPlaying)} />
  ) : (
    <PauseIcon css={stateChangeIndicatorStyle(prevIsPlayingRef.current === isPlaying)} />
  );
};

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

export default StateChangeIndicator;
