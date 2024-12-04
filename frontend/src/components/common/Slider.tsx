import { css } from '@emotion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Variables } from '@/styles';

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

  const moveProgress = useCallback(
    (e) => {
      const barLeft = sliderRef.current.getBoundingClientRect().left;
      const clickedX = e.clientX - barLeft;

      setFraction(clickedX / width);
    },
    [setFraction]
  );

  const moveProgressNow = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!sliderRef.current) return;
      moveProgress(e);
    },
    [moveProgress]
  );

  const startDragging = useCallback(() => {
    isMouseDownRef.current = true;
    onMouseDownStateChange(true);
  }, [onMouseDownStateChange]);

  const syncProgressWithDrag = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!isMouseDownRef.current) return;
      if (!sliderRef.current) return;

      moveProgress(e);
    },
    [moveProgress]
  );

  const endDragging = useCallback(
    (e) => {
      isMouseDownRef.current = false;
      onMouseDownStateChange(false);
      moveProgressNow(e);
    },
    [onMouseDownStateChange, moveProgress]
  );

  const handleClick = useCallback(
    (e) => {
      isMouseDownRef.current = false;
      moveProgressNow(e);
    },
    [moveProgressNow]
  );

  const handleMouseLeave = useCallback(
    (e) => {
      if (!isMouseDownRef.current) return;
      endDragging(e);
    },
    [endDragging]
  );

  useEffect(() => {
    if (sliderRef.current) setWidth(sliderRef.current.getBoundingClientRect().width);
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
        <div css={sliderEmptyStyle(mergedColor.empty, shouldHoverGrow)} style={sliderPositionStyle(bottom)}></div>
        <div
          css={sliderFillStyle(fraction, mergedColor.fill, mergedColor.thumb, shouldHoverGrow)}
          style={sliderPositionStyle(bottom)}
        ></div>
        {sliderRef.current && showThumb && (
          <div
            className="thumb"
            style={thumbStyle(fraction, mergedColor.thumb, bottom, sliderRef.current.offsetWidth)}
          ></div>
        )}
      </div>
    </>
  );
};

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

const sliderPositionStyle = (bottom: number) => ({
  position: 'absolute' as const,
  bottom: `${bottom}px`
});

const sliderCommonStyle = css({
  width: '100%',
  height: '0.25rem',
  borderRadius: '1.2rem'
});

const sliderEmptyStyle = (colorEmpty: string, shouldHoverGrow: boolean) =>
  css(
    sliderCommonStyle,
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

const sliderFillStyle = (fraction: number, colorFill: string, colorThumb: string, shouldHoverGrow: boolean) =>
  css(
    sliderCommonStyle,
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

const thumbStyle = (fraction: number, colorThumb: string, bottom: number, sliderWidth: number) => ({
  ...sliderPositionStyle(bottom),
  width: '0.75rem',
  height: '0.75rem',
  borderRadius: '100%',
  backgroundColor: colorThumb,
  transform: `translateX(${fraction * sliderWidth - 4}px) translateY(37.5%)`,
  transition: 'opacity 0.1s ease-out'
});

export default Slider;
