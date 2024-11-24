import { Variables } from '@/styles';
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';

interface Color {
  empty: string;
  fill: string;
}

interface SliderProps {
  fraction: number;
  setFraction: (newFraction: number) => void;
  bottom: number;
  shouldHoverGrow?: boolean;
  shouldExtendWhenDrag?: boolean;
  color?: Color;
}

const sliderWrapperStyle = (shouldExtendWhenDrag: boolean) =>
  css(
    {
      position: 'absolute',
      bottom: '0',
      width: '100%',
      height: '0.25rem',
      zIndex: '999',
      cursor: 'pointer'
    },
    shouldExtendWhenDrag
      ? {
          ':active': {
            height: '100%'
          }
        }
      : {}
  );

const sliderStyle = (bottom: number, colorEmpty: string, shouldHoverGrow: boolean) =>
  css(
    {
      position: 'absolute',
      bottom: `${bottom}px`,
      width: '100%',
      height: '0.25rem',
      backgroundColor: colorEmpty,
      transition: 'transform 0.2s ease-in-out'
    },
    shouldHoverGrow
      ? {
          ':hover': {
            transform: `scaleY(${1.535})`
          },
          ':active': {
            transform: `scaleY(${1.535})`
          }
        }
      : {}
  );

const sliderFillStyle = (
  fraction: number,
  colorFill: string,
  isMouseDown: boolean,
  bottom: number,
  shouldHoverGrow: boolean
) =>
  css(
    {
      position: 'absolute',
      bottom: `${bottom}px`,
      backgroundColor: colorFill,
      width: '100%',
      height: '0.25rem',

      PointerEvent: 'none',
      transformOrigin: 'left',
      transform: `scaleX(${fraction})`,
      transition: isMouseDown ? 'none' : 'transform 0.1s ease'
    },
    shouldHoverGrow
      ? {
          ':hover': {
            transform: `scaleX(${fraction}) scaleY(${1.535})`
          },
          ':active': {
            transform: `scaleX(${fraction}) scaleY(${1.535})`
          }
        }
      : {}
  );

const Slider = ({
  fraction,
  setFraction,
  bottom,
  shouldHoverGrow = false,
  shouldExtendWhenDrag = false,
  color = { empty: Variables.colors.surface_word_weak, fill: Variables.colors.surface_orange_strong }
}: SliderProps) => {
  const [width, setWidth] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef<boolean>(false);

  function moveProgressNow(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!sliderRef.current) return;

    const barLeft = sliderRef.current.getBoundingClientRect().left;
    const clickedX = e.clientX - barLeft;

    setFraction(clickedX / width);
  }

  function startDragging() {
    isMouseDownRef.current = true;
  }

  function syncProgressWithDrag(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!isMouseDownRef.current) return;
    if (!sliderRef.current) return;

    const barLeft = sliderRef.current.getBoundingClientRect().left;
    const clickedX = e.clientX - barLeft;

    setFraction(clickedX / width);
  }

  function endDragging() {
    isMouseDownRef.current = false;
  }

  useEffect(() => {
    if (sliderRef.current) setWidth(sliderRef.current.offsetWidth);
  }, []);

  return (
    <>
      <div
        css={sliderWrapperStyle(shouldExtendWhenDrag)}
        ref={sliderRef}
        onDrag={(e) => {
          e.preventDefault();
        }}
        onClick={moveProgressNow}
        onMouseDown={startDragging}
        onMouseMove={syncProgressWithDrag}
        onMouseUp={endDragging}
        onMouseLeave={endDragging}
      >
        <div css={sliderStyle(bottom, color.empty, shouldHoverGrow)}></div>
        <div css={sliderFillStyle(fraction, color.fill, isMouseDownRef.current, bottom, shouldHoverGrow)}></div>
      </div>
    </>
  );
};

export default Slider;
