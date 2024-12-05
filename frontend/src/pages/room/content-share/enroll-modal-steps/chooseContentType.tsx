import { css } from '@emotion/react';
import React, { ReactElement } from 'react';

import ImageIcon from '@/assets/icons/image.svg?react';
import YoutubeIcon from '@/assets/icons/youtube.svg?react';
import { flexStyle, Variables } from '@/styles';

import { StepComponentType } from '../contentEnrollModal';

interface OptionProps {
  icon: ReactElement;
  label: string;
  backgroundColor: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Option = ({ icon, label, backgroundColor, onClick }: OptionProps) => {
  return (
    <button
      css={[
        flexStyle(12, 'column'),
        {
          flex: '1 1 0',
          padding: '36px 24px 24px 24px',
          backgroundColor,
          borderRadius: 24,
          ':hover': {
            scale: 1.05
          },
          transition: 'scale 0.3s ease'
        }
      ]}
      onClick={onClick}
    >
      {icon}
      <span css={css({ font: Variables.typography.font_medium_16 })}>{label}</span>
    </button>
  );
};

const ChooseContentType: StepComponentType = ({ changeStepIndex }) => {
  return (
    <div css={css([{ width: '100%', padding: '12px 24px 32px 24px' }, flexStyle(36, 'column')])}>
      <h1 css={css({ font: Variables.typography.font_medium_36 })}>어떤 컨텐츠를 공유해 볼까요?</h1>
      <nav css={css([flexStyle(24)], { width: '100%' })}>
        <Option
          icon={<YoutubeIcon width={60} />}
          label="유튜브로 영상 공유하기"
          backgroundColor={Variables.colors.surface_youtube_weak}
          onClick={() => changeStepIndex(1)}
        />
        <Option
          icon={<ImageIcon width={60} height={40} fill={'#006FFF'} />}
          label="이미지 공유하기"
          backgroundColor={Variables.colors.surface_file_weak}
          onClick={() => changeStepIndex(2)}
        />
      </nav>
    </div>
  );
};

export default ChooseContentType;
