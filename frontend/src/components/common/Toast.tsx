import { css, keyframes } from '@emotion/react';
import CloseIcon from '../../assets/icons/close.svg?react';
import { useTimeout } from '../../hooks';
import { Variables } from '../../styles/Variables';

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

function parsePosition(position: string | undefined): [number, string] {
  const regex = /([0-9]+)(.*)/;
  const matches = position?.match(regex);
  if (matches) {
    return [Number(matches[1]), matches[2]];
  }
  return [0, ''];
}

const slideUp = (position: Position) => {
  const { bottom } = position;
  const [number, unit] = parsePosition(bottom);
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
  const [number, unit] = parsePosition(bottom);
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

  width: '21rem',
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

export default function Toast({
  icon,
  text,
  setToast,
  duration = 1750,
  position = { bottom: '1.5rem', left: '50%' }
}: ToastProps) {
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
}
