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
  shouldExtendAnytime?: boolean;
  color?: Color;
  onMouseDownStateChange?: (isDown: boolean) => void;
}

const sliderWrapperStyle = (shouldExtendWhenDrag: boolean, shouldExtendAnytime: boolean) =>
  css(
    {
      position: 'absolute',
      bottom: '0',
      width: '100%',
      height: '0.35rem',
      zIndex: '999',
      cursor: 'pointer'
    },
    shouldExtendAnytime ? { height: '100%' } : {},
    shouldExtendWhenDrag
      ? {
          ':active': {
            height: '100%'
          }
        }
      : {}
  );

const sliderCommonStyle = (bottom: number) =>
  css({
    position: 'absolute',
    bottom: `${bottom}px`,
    width: '100%',
    height: '0.25rem',
    borderRadius: '1rem'
  });

const sliderEmptyStyle = (bottom: number, colorEmpty: string, shouldHoverGrow: boolean) =>
  css(
    sliderCommonStyle(bottom),
    {
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

const sliderFillStyle = (fraction: number, colorFill: string, bottom: number, shouldHoverGrow: boolean) =>
  css(
    sliderCommonStyle(bottom),
    {
      backgroundColor: colorFill,
      transformOrigin: 'left',
      transform: `scaleX(${fraction})`
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
  shouldExtendAnytime = false,
  color = { empty: Variables.colors.surface_transparent_white_35, fill: Variables.colors.surface_orange_strong },
  onMouseDownStateChange = () => {}
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
    onMouseDownStateChange(true);
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
    onMouseDownStateChange(false);
  }

  useEffect(() => {
    if (sliderRef.current) setWidth(sliderRef.current.offsetWidth);
  }, []);

  return (
    <>
      <div
        css={sliderWrapperStyle(shouldExtendWhenDrag, shouldExtendAnytime)}
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
        <div css={sliderEmptyStyle(bottom, color.empty, shouldHoverGrow)}></div>
        <div css={sliderFillStyle(fraction, color.fill, bottom, shouldHoverGrow)}></div>
      </div>
    </>
  );
};

export default Slider;
