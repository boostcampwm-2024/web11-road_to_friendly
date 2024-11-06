import { css, keyframes } from '@emotion/react';

const growScale = 'scale(1.035)';

const jump = keyframes({
  '0%': {
    transform: `${growScale} translateY(0)`
  },
  '50%': {
    transform: `${growScale} translateY(-0.7rem)`
  },
  '100%': {
    transform: `${growScale} translateY(0)`
  }
});

const hoverGrow = css({
  transition: 'transform 0.2s ease-in-out',
  ':hover': {
    transform: growScale
  }
});

export const hoverGrowJumpAnimation = css(
  {
    ':hover': {
      animation: `${jump} 0.5s ease-out`
    }
  },
  hoverGrow
);
