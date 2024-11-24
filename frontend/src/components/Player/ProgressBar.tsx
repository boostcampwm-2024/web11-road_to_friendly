import { Variables } from '@/styles';
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';

interface ProgressBarProps {
  fraction: number;
  setFractionAndMove: (newFraction: number) => void;
  progressBarBottom: number;
}

const progressWrapperStyle = css({
  position: 'absolute',
  bottom: '0',
  width: '100%',
  height: '0.25rem',
  zIndex: '999',
  cursor: 'pointer',
  ':active': {
    height: '100%'
  }
});

const progressBarStyle = (progressBarBottom: number) =>
  css({
    position: 'absolute',
    bottom: `${progressBarBottom}px`,
    width: '100%',
    height: '0.25rem',
    backgroundColor: Variables.colors.surface_word_weak,

    transition: 'transform 0.2s ease-in-out',
    ':hover': {
      transform: `scaleY(${1.535})`
    },
    ':active': {
      transform: `scaleY(${1.535})`
    }
  });

const progressBarFillStyle = (fraction: number, isMouseDown: boolean, progressBarBottom: number) =>
  css({
    position: 'absolute',
    bottom: `${progressBarBottom}px`,
    backgroundColor: Variables.colors.surface_orange_strong,
    width: '100%',
    height: '0.25rem',

    PointerEvent: 'none',
    transformOrigin: 'left',
    transform: `scaleX(${fraction})`,
    transition: isMouseDown ? 'none' : 'transform 0.1s ease',

    ':hover': {
      transform: `scaleX(${fraction}) scaleY(${1.535})`
    },
    ':active': {
      transform: `scaleX(${fraction}) scaleY(${1.535})`
    }
  });

const ProgressBar = ({ fraction, setFractionAndMove, progressBarBottom }: ProgressBarProps) => {
  const [width, setWidth] = useState(0);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef<boolean>(false);

  function moveProgressNow(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!progressBarRef.current) return;

    const barLeft = progressBarRef.current.getBoundingClientRect().left;
    const clickedX = e.clientX - barLeft;

    setFractionAndMove(clickedX / width);
  }

  function startDragging() {
    isMouseDownRef.current = true;
  }

  function syncProgressWithDrag(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!isMouseDownRef.current) return;
    if (!progressBarRef.current) return;

    const barLeft = progressBarRef.current.getBoundingClientRect().left;
    const clickedX = e.clientX - barLeft;

    setFractionAndMove(clickedX / width);
  }

  function endDragging() {
    isMouseDownRef.current = false;
  }

  useEffect(() => {
    if (progressBarRef.current) setWidth(progressBarRef.current.offsetWidth);
  }, []);

  return (
    <>
      <div
        css={progressWrapperStyle}
        ref={progressBarRef}
        onDrag={(e) => {
          e.preventDefault();
        }}
        onClick={moveProgressNow}
        onMouseDown={startDragging}
        onMouseMove={syncProgressWithDrag}
        onMouseUp={endDragging}
        onMouseLeave={endDragging}
      >
        <div css={progressBarStyle(progressBarBottom)}></div>
        <div css={progressBarFillStyle(fraction, isMouseDownRef.current, progressBarBottom)}></div>
      </div>
    </>
  );
};

export default ProgressBar;
