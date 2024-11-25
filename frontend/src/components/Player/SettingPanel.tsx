import { Variables } from '@/styles';
import { css } from '@emotion/react';
import { useState } from 'react';
import YouTubePlayer from 'react-player/youtube';

import SpeedFillIcon from '@/assets/icons/speed-fill.svg?react';
import QualityIcon from '@/assets/icons/equalizer-2-line.svg?react';
import ArrowLeftIcon from '@/assets/icons/arrow-left-s-line.svg?react';
import ArrowRightIcon from '@/assets/icons/arrow-right-s-line.svg?react';
import CheckIcon from '@/assets/icons/check-line.svg?react';

type SettingTarget = 'selection' | 'speed' | 'quality';

interface SettingPanelProps {
  player: YouTubePlayer;
  controllBarHeight: number;
}

interface SettingSelectionProps {
  setSettingTarget: React.Dispatch<React.SetStateAction<SettingTarget>>;
}

interface SettingSpeedProps {
  player: YouTubePlayer;
  setSettingTarget: React.Dispatch<React.SetStateAction<SettingTarget>>;
}

interface SettingQualityProps {
  player: YouTubePlayer;
  setSettingTarget: React.Dispatch<React.SetStateAction<SettingTarget>>;
}

const qualityTextMap: Record<string, string> = {
  highres: '최고 화질',
  hd1080: '1080p',
  hd720: '720p',
  large: '480p',
  medium: '360p',
  small: '240p',
  tiny: '144p',
  auto: '자동'
};

const settingPanelStyle = (controllBarHeight: number) =>
  css({
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',

    width: 'fit-content',
    padding: '0.95rem',
    borderRadius: '0.75rem',
    backgroundColor: Variables.colors.surface_transparent_darkgrey_75,
    color: Variables.colors.text_white,
    font: Variables.typography.font_medium_14,

    position: 'absolute',
    right: '1rem',
    bottom: `${controllBarHeight + 12}px`,

    button: {
      backgroundColor: 'transparent'
    }
  });

const optionStyle = css({
  display: 'flex',
  width: '100%',
  gap: '2rem',
  justifyContent: 'space-between'
});

const iconStyle = css({
  fill: Variables.colors.text_white,
  width: '1rem',
  height: '1rem'
});

const textAreaStyle = css({
  display: 'flex',
  gap: '0.5rem'
});

const detailOptionListStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  maxHeight: '8rem',
  padding: '0 0.5rem',
  overflowY: 'scroll'
});

const panelHeaderStyle = css({
  display: 'flex',
  gap: '1rem'
});

const scrollbarStyle = css({
  '*::-webkit-scrollbar': {
    width: '0.125rem',
    borderRadius: '0.5rem'
  },
  '*::-webkit-scrollbar-thumb': {
    backgroundColor: Variables.colors.surface_white,
    borderRadius: '0.5rem'
  },
  '*::-webkit-scrollbar-track': {
    backgroundColor: Variables.colors.surface_transparent_white_35
  }
});

const optionItemStyle = (checked: boolean) =>
  css({
    display: 'block',
    position: 'relative',
    cursor: 'pointer',
    padding: '0.25rem 1.25rem',
    textAlign: 'left',
    borderRadius: '0.25rem',
    backgroundColor: checked ? Variables.colors.surface_transparent_white_35 : 'transparent'
  });

const checkedIconStyle = css(iconStyle, {
  position: 'absolute',
  left: '0'
});

const SettingSelection = ({ setSettingTarget }: SettingSelectionProps) => {
  return (
    <>
      <button css={optionStyle} onClick={() => setSettingTarget('speed')}>
        <SpeedFillIcon css={iconStyle} />
        <div css={textAreaStyle}>
          <p>재생 속도</p>
          <ArrowRightIcon css={iconStyle} />
        </div>
      </button>
      <button css={optionStyle} onClick={() => setSettingTarget('quality')}>
        <QualityIcon css={iconStyle} />
        <div css={textAreaStyle}>
          <p>화질</p>
          <ArrowRightIcon css={iconStyle} />
        </div>
      </button>
    </>
  );
};

const SettingSpeed = ({ setSettingTarget, player }: SettingSpeedProps) => {
  const internalPlayer = player.getInternalPlayer();

  const [speed, setSpeed] = useState(internalPlayer.getPlaybackRate());

  return (
    <>
      <button css={panelHeaderStyle} onClick={() => setSettingTarget('selection')}>
        <ArrowLeftIcon css={iconStyle} />
        <p>재생 속도</p>
      </button>
      <div css={detailOptionListStyle}>
        {internalPlayer.getAvailablePlaybackRates().map((playbackRate: number) => {
          const checked = speed === playbackRate;
          return (
            <label key={playbackRate} css={optionItemStyle(checked)}>
              {checked && <CheckIcon css={checkedIconStyle} />}
              {playbackRate}
              <input
                type="radio"
                name="playbackRadio"
                css={{ display: 'none' }}
                value={playbackRate}
                checked={checked}
                onChange={(e) => {
                  const newSpeed = Number(e.target.value);
                  setSpeed(newSpeed);
                  internalPlayer.setPlaybackRate(newSpeed);
                }}
              />
            </label>
          );
        })}
      </div>
    </>
  );
};

const SettingQuality = ({ setSettingTarget, player }: SettingQualityProps) => {
  const internalPlayer = player.getInternalPlayer();

  const [quality, setQuality] = useState(internalPlayer.getPlaybackQuality());

  function getQualityText(quality: string) {
    if (qualityTextMap[quality]) return qualityTextMap[quality];

    const numberRegex = /([0-9]+)/;
    const numberMatches = quality.match(numberRegex);
    if (numberMatches) return numberMatches[1];
    return quality;
  }

  return (
    <>
      <button css={panelHeaderStyle} onClick={() => setSettingTarget('selection')}>
        <ArrowLeftIcon css={iconStyle} />
        <p>화질</p>
      </button>
      <div css={detailOptionListStyle}>
        {internalPlayer.getAvailableQualityLevels().map((playbackQuality: number) => {
          const checked = quality === playbackQuality;
          return (
            <label key={playbackQuality} css={optionItemStyle(checked)}>
              {checked && <CheckIcon css={checkedIconStyle} />}
              {getQualityText(playbackQuality.toString())}
              <input
                type="radio"
                name="playbackRadio"
                css={{ display: 'none' }}
                value={playbackQuality}
                checked={checked}
                onChange={(e) => {
                  const newQuality = e.target.value;
                  setQuality(newQuality);
                  internalPlayer.setPlaybackQuality(newQuality);
                }}
              />
            </label>
          );
        })}
      </div>
    </>
  );
};

const SettingPanel = ({ player, controllBarHeight }: SettingPanelProps) => {
  const [settingTarget, setSettingTarget] = useState<SettingTarget>('selection');

  return (
    <>
      <div css={[settingPanelStyle(controllBarHeight), scrollbarStyle]}>
        {settingTarget === 'selection' && <SettingSelection setSettingTarget={setSettingTarget} />}
        {settingTarget === 'speed' && <SettingSpeed setSettingTarget={setSettingTarget} player={player} />}
        {settingTarget === 'quality' && <SettingQuality setSettingTarget={setSettingTarget} player={player} />}
      </div>
    </>
  );
};

export default SettingPanel;
