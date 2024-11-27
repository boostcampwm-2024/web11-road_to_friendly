import { css } from '@emotion/react';

import { rotate, Variables } from '@/styles';
import { divideSize } from '@/utils';

const spinnerStyle = (roundSize: string, width: string, emptyColor: string, fillColor: string, speed: string) =>
  css({
    width: roundSize,
    height: roundSize,
    borderRadius: '50%',
    border: `solid ${width} ${emptyColor}`,
    borderTop: `solid ${width} ${fillColor}`,
    animation: `${rotate} ${speed} ease-in-out infinite`
  });

const LoadingSpinner = ({
  roundSize = '0.9rem',
  width = divideSize(roundSize, 6.5),
  emptyColor = Variables.colors.surface_alt,
  fillColor = Variables.colors.surface_strong,
  speed = '0.77s'
}) => {
  return <div css={spinnerStyle(roundSize, width, emptyColor, fillColor, speed)}></div>;
};

export default LoadingSpinner;
