import { Group } from '@/types';
import { css, SerializedStyles } from '@emotion/react';
import { Variables } from './Variables';

type StatisticsStyleMap = () => Record<Group, SerializedStyles>;

export const StatisticsStyleMap: StatisticsStyleMap = () => {
  return {
    Big: css({
      color: Variables.colors.text_white,
      backgroundColor: Variables.colors.text_word_strong,
      borderRadius: '2rem',
      border: `none`
    }),
    Medium: css({
      color: Variables.colors.text_white,
      backgroundColor: Variables.colors.text_word_medium,
      borderRadius: '1.5rem',
      border: `none`
    }),
    Small: css({
      color: Variables.colors.text_word_weak,
      backgroundColor: Variables.colors.surface_word_weak,
      borderRadius: '1.25rem',
      border: `solid 0.25rem ${Variables.colors.text_word_weak}`
    }),
    Tiny: css({
      color: Variables.colors.text_weak,
      backgroundColor: Variables.colors.surface_word_default,
      borderRadius: '1rem',
      border: `solid 0.25rem ${Variables.colors.text_weak}`
    })
  };
};
