import { css, keyframes } from '@emotion/react';

export const rotate = keyframes({
  '0%': {
    transform: 'rotate(0)'
  },
  '100%': {
    transform: 'rotate(360deg)'
  }
});

export const jump = (baseTransform: string, height: string = '0.7rem') =>
  keyframes({
    '0%': {
      transform: `${baseTransform} translateY(0)`
    },
    '50%': {
      transform: `${baseTransform} translateY(-${height})`
    },
    '100%': {
      transform: `${baseTransform} translateY(0)`
    }
  });

export const growAndShrink = keyframes({
  '0%': {
    transform: 'scale(0)'
  },
  '2%': {
    transform: 'scale(0)'
  },
  '49%': {
    transform: 'scale(1)'
  },
  '51%': {
    transform: 'scale(1)'
  }
});

export const hoverGrow = (scale: number = 1.035) =>
  css({
    transition: 'transform 0.2s ease-in-out',
    ':hover': {
      transform: `scale(${scale})`
    }
  });

export const hoverGrowJumpAnimation = ({ scale = 1.035, height = '0.7rem' } = {}) =>
  css(
    {
      ':hover': {
        animation: `${jump(`scale(${scale})`, height)} 0.5s ease-out`
      }
    },
    hoverGrow(scale)
  );
