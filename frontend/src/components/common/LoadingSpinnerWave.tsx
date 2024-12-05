import { css } from '@emotion/react';

import { useIndex } from '@/hooks';
import { growAndShrink } from '@/styles';

const DEFAULT_DELAY = 0.165;
const COLOR_DIFF = 40;
const HUE_MAX_VALUE = 360;
const HUE_MAX_INDEX = Math.ceil(HUE_MAX_VALUE / COLOR_DIFF);

function getPastelColor(index: number) {
  const SATURATION = '82%';
  const LIGHTNESS = '89%';
  const ALPHA = '0.7';

  return `hsla(${COLOR_DIFF * index}, ${SATURATION}, ${LIGHTNESS}, ${ALPHA})`;
}

const Round = ({ colorStartIndex = 0, duration = DEFAULT_DELAY * 10, delay = 0, roundSize = '6rem' }) => {
  const [index, addIndex] = useIndex(HUE_MAX_INDEX, colorStartIndex);
  return (
    <div
      css={[roundStyle(getPastelColor(index), duration, roundSize, delay)]}
      onAnimationIteration={() => {
        addIndex();
      }}
    ></div>
  );
};

const LoadingSpinnerWave = ({ delay = DEFAULT_DELAY, roundSize = '2.5rem' }) => {
  return (
    <div css={loadingSpinnerWaveStyle}>
      <Round roundSize={roundSize} duration={delay * 10} />
      <Round
        roundSize={roundSize}
        duration={delay * 10}
        colorStartIndex={Math.floor((3.5 * HUE_MAX_INDEX) / 4)}
        delay={delay}
      />
      <Round
        roundSize={roundSize}
        duration={delay * 10}
        colorStartIndex={Math.floor((1.5 * HUE_MAX_INDEX) / 4)}
        delay={delay * 2}
      />
      <Round
        roundSize={roundSize}
        duration={delay * 10}
        colorStartIndex={Math.floor((2.5 * HUE_MAX_INDEX) / 4)}
        delay={delay * 3}
      />
    </div>
  );
};

export default LoadingSpinnerWave;

const roundStyle = (color: string, duration: number, roundSize: string, delay: number = 0) => {
  return css({
    width: roundSize,
    height: roundSize,
    borderRadius: '50%',
    position: 'relative',
    backgroundColor: color,

    transform: 'scale(0)',
    animation: `${growAndShrink} ${duration}s ease-in-out infinite`,
    animationDelay: `${delay}s`
  });
};

const loadingSpinnerWaveStyle = css({
  display: 'flex',
  gap: '0.5rem',
  position: 'relative',
  width: `fit-content`,
  height: `fit-content`
});
