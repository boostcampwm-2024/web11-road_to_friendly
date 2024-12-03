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

export const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 }
});

export const fadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 }
});

export const scaleIn = keyframes({
  from: {
    transform: 'scale(0)' // 애니메이션 시작 시 크기 0
  },
  to: {
    transform: 'scale(1)' // 애니메이션 끝날 때 크기 1
  }
});

export const growAndDiplay = (baseTransform: string) =>
  keyframes({
    '0%': {
      opacity: '0',
      transform: `${baseTransform} scale(0)`
    },
    '48%': {
      opacity: '1',
      transform: `${baseTransform} scale(1)`
    },
    '60%': {
      opacity: '0.3',
      transform: `${baseTransform} scale(1.4)`
    },
    '100%': {
      opacity: '0',
      transform: `${baseTransform} scale(2)`
    }
  });
