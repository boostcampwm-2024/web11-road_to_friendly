import { Variables } from '@/styles';
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';

interface Color {
  empty?: string;
  fill?: string;
  thumb?: string;
}

interface SliderProps {
  showThumb?: boolean;
  fraction: number;
  setFraction: (newFraction: number) => void;
  bottom: number;
  shouldHoverGrow?: boolean;
  shouldExtendWhenDrag?: boolean;
  shouldExtendAnytime?: boolean;
  shouldThumbAnytime?: boolean;
  color?: Color;
  onMouseDownStateChange?: (isDown: boolean) => void;
}

const thumbDisplayStyle = (shouldThumbAnytime: boolean) =>
  css(
    !shouldThumbAnytime && {
      ':hover, :active': {
        '.thumb': {
          opacity: '1'
        }
      },
      '.thumb': {
        opacity: '0'
      }
    }
  );

const sliderWrapperStyle = (shouldExtendWhenDrag: boolean, shouldExtendAnytime: boolean, shouldThumbAnytime: boolean) =>
  css(
    {
      position: 'absolute',
      bottom: '0',
      width: '100%',
      height: '0.25rem',
      zIndex: '999',
      cursor: 'pointer',
      boxSizing: 'border-box'
    },
    shouldExtendAnytime ? { height: '100%' } : {},
    shouldExtendWhenDrag
      ? {
          ':active': {
            height: '100%'
          }
        }
      : {},
    thumbDisplayStyle(shouldThumbAnytime)
  );

const sliderPositionStyle = (bottom: number) =>
  css({
    position: 'absolute',
    bottom: `${bottom}px`
  });

const sliderCommonStyle = (bottom: number) =>
  css(sliderPositionStyle(bottom), {
    width: '100%',
    height: '0.25rem',
    borderRadius: '1.2rem'
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
          ':hover, :active': {
            transform: `scaleY(${1.535})`
          }
        }
      : {}
  );

const sliderFillStyle = (
  fraction: number,
  colorFill: string,
  colorThumb: string,
  bottom: number,
  shouldHoverGrow: boolean
) =>
  css(
    sliderCommonStyle(bottom),
    {
      background: `linear-gradient(to right, ${colorFill} 60%, ${colorThumb})`,
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

const thumbStyle = (fraction: number, colorThumb: string, bottom: number, sliderWidth: number) =>
  css(sliderPositionStyle(bottom), {
    width: '0.75rem',
    height: '0.75rem',
    borderRadius: '100%',
    backgroundColor: colorThumb,
    transform: `translateX(${fraction * sliderWidth - 4}px) translateY(37.5%)`,
    transition: 'opacity 0.1s ease-out'
  });

const defaultColor = {
  empty: Variables.colors.surface_transparent_white_35,
  fill: Variables.colors.surface_white,
  thumb: Variables.colors.surface_youtube_weak
};

const Slider = ({
  showThumb = true,
  fraction,
  setFraction,
  bottom,
  shouldHoverGrow = false,
  shouldExtendWhenDrag = false,
  shouldExtendAnytime = false,
  shouldThumbAnytime = true,
  color = {},
  onMouseDownStateChange = () => {}
}: SliderProps) => {
  const [width, setWidth] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef<boolean>(false);
  const mergedColor = { ...defaultColor, ...color };

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

  function endDragging(e) {
    isMouseDownRef.current = false;
    onMouseDownStateChange(false);
    moveProgressNow(e);
  }

  function handleClick(e) {
    isMouseDownRef.current = false;
    moveProgressNow(e);
  }

  function handleMouseLeave(e) {
    if (!isMouseDownRef.current) return;
    endDragging(e);
  }

  useEffect(() => {
    if (sliderRef.current) setWidth(sliderRef.current.offsetWidth);
  }, []);

  return (
    <>
      <div
        css={sliderWrapperStyle(shouldExtendWhenDrag, shouldExtendAnytime, shouldThumbAnytime)}
        ref={sliderRef}
        onClick={handleClick}
        onMouseDown={startDragging}
        onMouseMove={syncProgressWithDrag}
        onMouseUp={endDragging}
        onMouseLeave={handleMouseLeave}
      >
        <div css={sliderEmptyStyle(bottom, mergedColor.empty, shouldHoverGrow)}></div>
        <div css={sliderFillStyle(fraction, mergedColor.fill, mergedColor.thumb, bottom, shouldHoverGrow)}></div>
        {showThumb && <div className="thumb" css={thumbStyle(fraction, mergedColor.thumb, bottom, width)}></div>}
      </div>
    </>
  );
};

export default Slider;
