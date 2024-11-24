import { Variables } from '@/styles';
import { css } from '@emotion/react';

import SpeedFillIcon from '@/assets/icons/speed-fill.svg?react';
import QualityIcon from '@/assets/icons/equalizer-2-line.svg?react';

interface SettingPanelProps {
  controllBarHeight: number;
}

const settingPanelStyle = (controllBarHeight: number) =>
  css({
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',

    width: 'fit-content',
    padding: '1rem 1rem',
    borderRadius: '0.75rem',
    backgroundColor: Variables.colors.surface_transparent_black_50,
    color: Variables.colors.text_white,
    font: Variables.typography.font_medium_14,

    position: 'absolute',
    right: '1rem',
    bottom: `${controllBarHeight + 10}px`
  });

const optionStyle = css({
  display: 'flex',
  gap: '1rem'
});

const iconStyle = css({
  fill: Variables.colors.text_white,
  width: '1rem',
  height: '1rem'
});

const SettingPanel = ({ controllBarHeight }: SettingPanelProps) => {
  return (
    <div css={settingPanelStyle(controllBarHeight)}>
      <div css={optionStyle}>
        <SpeedFillIcon css={iconStyle} />
        <p>재생속도</p>
      </div>
      <div css={optionStyle}>
        <QualityIcon css={iconStyle} />
        <p>화질</p>
      </div>
    </div>
  );
};

export default SettingPanel;
