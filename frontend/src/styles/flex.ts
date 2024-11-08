import { css } from '@emotion/react';
import type { Properties } from 'csstype';

export const flexStyle = (
  gap: number,
  flexDirection: Properties['flexDirection'] = 'row',
  justifyContent: Properties['justifyContent'] = 'center',
  alignItems: Properties['alignItems'] = 'center'
) => {
  return css({
    display: 'flex',
    flexDirection,
    justifyContent,
    alignItems,
    gap: `${gap}px`
  });
};
