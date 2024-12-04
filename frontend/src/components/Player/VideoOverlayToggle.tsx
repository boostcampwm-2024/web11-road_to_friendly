import { css } from '@emotion/react';
import { memo } from 'react';

interface VideoOverlayToggleProps {
  isPlaying: boolean;
  sharerControlFunctions: { playVideoAsSharer: () => void; pauseVideoAsSharer: () => void };
}

const VideoOverlayToggle = memo(({ isPlaying, sharerControlFunctions }: VideoOverlayToggleProps) => {
  const { playVideoAsSharer, pauseVideoAsSharer } = sharerControlFunctions;

  function toggleVideo() {
    if (isPlaying) pauseVideoAsSharer();
    else playVideoAsSharer();
  }

  return (
    <div
      css={mediaSectionStyle}
      onClick={toggleVideo}
      onDrag={(e) => {
        e.preventDefault();
      }}
    ></div>
  );
});

const mediaSectionStyle = css({
  position: 'absolute',
  zIndex: '998',
  top: '0',
  width: '100%',
  height: '80%'
});

export default VideoOverlayToggle;
