import { css } from '@emotion/react';
import { useState } from 'react';

import CloseIcon from '@/assets/icons/close.svg?react';
import LeftArrowIcon from '@/assets/icons/leftArrow.svg?react';
import { flexStyle, Variables } from '@/styles';

import { EnrollImageContent, EnrollYoutubeContent, ChooseContentType } from './enroll-modal-steps';

interface ContentEnrollModalProps {
  closeModal: () => void;
}

export type StepComponentType = React.ComponentType<{
  changeStepIndex: (index: number) => void;
  closeModal: () => void;
}>;

interface EnrollModalSteps {
  previousStepIndex: number;
  label: string;
  component: StepComponentType;
}

const steps: EnrollModalSteps[] = [
  {
    previousStepIndex: -1,
    label: '',
    component: ChooseContentType
  },
  {
    previousStepIndex: 0,
    label: '유튜브로 영상 공유하기',
    component: EnrollYoutubeContent
  },
  {
    previousStepIndex: 0,
    label: '이미지 공유하기',
    component: EnrollImageContent
  }
];

const ContentEnrollModal = ({ closeModal }: ContentEnrollModalProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const changeStepIndex = (index: number) => setCurrentStepIndex(index);

  const StepComponent = steps[currentStepIndex].component;

  return (
    <div css={Container}>
      <div css={NavBar}>
        <div css={[flexStyle(16)]}>
          {currentStepIndex > 0 && (
            <button css={Button} onClick={() => setCurrentStepIndex(steps[currentStepIndex].previousStepIndex)}>
              <LeftArrowIcon fill={'#777'} width={16} height={16} cursor={'pointer'} />
            </button>
          )}
          <div
            css={css({
              color: Variables.colors.text_default,
              font: Variables.typography.font_medium_24
            })}
          >
            {steps[currentStepIndex].label}
          </div>
        </div>
        <button css={Button} onClick={closeModal}>
          <CloseIcon fill={'#777'} stroke={'#777'} width={16} height={16} cursor={'pointer'} />
        </button>
      </div>
      <StepComponent changeStepIndex={changeStepIndex} closeModal={closeModal} />
    </div>
  );
};

export default ContentEnrollModal;

const Container = css([
  {
    width: '40vw',
    minWidth: '400px'
  },
  flexStyle(12, 'column')
]);

const NavBar = css([
  {
    width: '100%'
  },
  flexStyle(0, 'row', 'space-between')
]);

const Button = css([
  {
    padding: 8,
    borderRadius: '999px',
    ':hover': {
      backgroundColor: '#e9e9e9'
    },
    transition: 'background-color 0.5s ease'
  },
  flexStyle(0)
]);
