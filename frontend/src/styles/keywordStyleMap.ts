import { css, SerializedStyles } from '@emotion/react';

import { Group } from '@/types';

import { Variables } from './Variables';

type KeywordStyleMap = (selected: boolean) => Record<Group, SerializedStyles>;

export const keywordStyleMap: KeywordStyleMap = (selected: boolean) => {
  const borderStyle = (color: string, selected: boolean) => ({
    border: selected ? `solid 0.25rem ${color}` : 'none'
  });

  return {
    Big: css(
      {
        font: Variables.typography.font_bold_48,
        color: Variables.colors.text_word_strong,
        backgroundColor: Variables.colors.surface_word_strong,
        borderRadius: '2rem'
      },
      borderStyle(Variables.colors.text_word_strong, selected)
    ),
    Medium: css(
      {
        font: Variables.typography.font_bold_36,
        color: Variables.colors.text_word_medium,
        backgroundColor: Variables.colors.surface_word_medium,
        borderRadius: '1.5rem'
      },
      borderStyle(Variables.colors.text_word_medium, selected)
    ),
    Small: css(
      {
        font: Variables.typography.font_bold_24,
        color: Variables.colors.text_word_weak,
        backgroundColor: Variables.colors.surface_word_weak,
        borderRadius: '1.25rem'
      },
      borderStyle(Variables.colors.text_word_weak, selected)
    ),
    Tiny: css(
      {
        font: Variables.typography.font_bold_16,
        color: Variables.colors.text_weak,
        backgroundColor: Variables.colors.surface_word_default,
        borderRadius: '1rem'
      },
      borderStyle(Variables.colors.text_weak, selected)
    )
  };
};
