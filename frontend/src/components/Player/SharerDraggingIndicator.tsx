import { Variables } from '@/styles';
import { css } from '@emotion/react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { memo } from 'react';

interface SharerDraggingIndicatorProps {
  isSharerDragging: boolean;
}

const SharerDraggingIndicator = memo(({ isSharerDragging }: SharerDraggingIndicatorProps) => {
  return (
    <div css={sharerDraggingIndicatorStyle(isSharerDragging)}>
      <p css={textStyle}>공유자가 영상을 탐색 중입니다. 잠시만 기다려주세요!</p>
      <div css={lottieContainerStyle}>
        <DotLottieReact
          src="https://lottie.host/f12f6ee7-86c1-46d6-8340-03434ad15f62/VGZwdJK6WD.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
});

const sharerDraggingIndicatorStyle = (isSharerDragging: boolean) =>
  css({
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: Variables.colors.surface_transparent_black_50,
    backdropFilter: 'blur(6px)',
    zIndex: '999',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: isSharerDragging ? 1 : 0,
    transition: `opacity 0.5s ease-in`,
    pointerEvents: 'none'
  });

const lottieContainerStyle = css({
  height: '50%',
  width: '50%'
});

const textStyle = css({
  color: Variables.colors.text_white,
  font: Variables.typography.font_medium_16
});

export default SharerDraggingIndicator;
