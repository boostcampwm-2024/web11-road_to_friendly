import { css, keyframes } from '@emotion/react';

import CloseIcon from '@/assets/icons/close.svg?react';
import { useTimeout } from '@/hooks';
import { Variables } from '@/styles';
import { parseNumberAndUnit } from '@/utils';

type Position = {
  bottom?: string;
  left?: string;
};

type ToastProps = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  text: string;
  setToast: React.Dispatch<React.SetStateAction<boolean>>;
  duration?: number;
  position?: Position;
};

const slideUp = (position: Position) => {
  const { bottom } = position;
  const [number, unit] = parseNumberAndUnit(bottom);
  return keyframes({
    '0%': {
      opacity: '0',
      transform: `translate(-50%, 0%) translateY(${2 * number}${unit})`
    },
    '100%': {
      opacity: '1',
      transform: `translate(-50%, 0%)`
    }
  });
};

const slideDown = (position: Position) => {
  const { bottom } = position;
  const [number, unit] = parseNumberAndUnit(bottom);
  return keyframes({
    '0%': {
      opacity: '1',
      transform: `translate(-50%, 0%)`
    },
    '100%': {
      opacity: '0',
      transform: `translate(-50%, 0%) translateY(${2 * number}${unit})`
    }
  });
};

const toastCss = css({
  position: 'fixed',
  transform: 'translate(-50%, 0%)',

  minWidth: '21rem',
  padding: '1.5rem 1rem',
  borderRadius: '0.75rem',
  boxSizing: 'content-box',

  display: 'flex',
  gap: '0.75rem',
  alignItems: 'center',

  font: Variables.typography.font_medium_16,
  color: Variables.colors.text_white,
  backgroundColor: Variables.colors.surface_strong
});

const Toast = ({ icon, text, setToast, duration = 1750, position = { bottom: '1.5rem', left: '50%' } }: ToastProps) => {
  const [timeover, setTimeover] = useTimeout(duration);
  const Icon = icon;

  function handleAnimationEnd() {
    if (timeover) {
      setToast(false);
    }
  }

  return (
    <div
      css={[
        toastCss,
        position,
        { animation: `${timeover ? slideDown(position) : slideUp(position)} 0.1s ease-out forwards` }
      ]}
      onAnimationEnd={handleAnimationEnd}
    >
      <Icon />
      <div css={{ display: 'flex', justifyContent: 'space-between', flex: '1' }}>
        {text}
        <button
          css={{ width: '1.25rem', cursor: 'pointer', backgroundColor: 'transparent', ':focus': { outline: 'none' } }}
          onClick={() => setTimeover(true)}
        >
          <CloseIcon stroke={Variables.colors.text_white} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
