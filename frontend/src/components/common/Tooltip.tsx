import { css } from '@emotion/react';

import { Variables } from '../../styles/Variables';

type Direction = 'UP' | 'DOWN';
type Position = 'LEFT' | 'CENTER' | 'RIGHT';

interface TooltipProps {
  message: string;
  direction?: Direction;
  position?: Position;
}

const positionStyleMap = {
  LEFT: { left: '1.2rem' },
  CENTER: { left: '50%' },
  RIGHT: { right: '1.2rem' }
};

const directionStyleMap = {
  UP: {
    marginTop: '0.85rem',
    borderColor: `transparent transparent ${Variables.colors.surface_white} transparent`
  },
  DOWN: { marginTop: '-0.85rem', borderColor: `${Variables.colors.surface_white} transparent transparent transparent` }
};

function getDirectionPosition(direction: Direction, position: Position) {
  const translateX = position === 'CENTER' ? 'translateX(-50%)' : '';
  const translateY = direction === 'UP' ? 'translateY(-100%)' : '';
  const transform = { transform: translateX + translateY };

  return [positionStyleMap[position], directionStyleMap[direction], transform];
}

const Tooltip = ({ message, direction = 'DOWN', position = 'RIGHT' }: TooltipProps) => {
  return (
    <div css={tooltipSylte}>
      {direction === 'UP' && <div css={tailStyle(direction, position)}></div>}
      <div css={textBoxStyle}>{message}</div>
      {direction === 'DOWN' && <div css={tailStyle(direction, position)}></div>}
    </div>
  );
};

export default Tooltip;

const tooltipSylte = css({
  display: 'block',
  position: 'relative',
  width: 'fit-content',
  maxWidth: '33rem',
  height: 'fit-content',
  filter: `drop-shadow(${Variables.shadow.shadow_floating})`
});

const textBoxStyle = css({
  padding: '1.375rem 1.25rem',
  borderRadius: '1rem',
  width: 'fit-content',
  height: 'fit-content',
  backgroundColor: Variables.colors.surface_white,
  font: Variables.typography.font_medium_16,
  color: Variables.colors.text_default
});

const tailStyle = (direction: Direction, position: Position) =>
  css(
    {
      position: 'absolute',
      backgroundColor: 'transparent',

      width: '0',
      height: '0',
      borderStyle: 'solid',
      borderWidth: '2rem 0.95rem 2rem 0.95rem'
    },
    getDirectionPosition(direction, position)
  );
