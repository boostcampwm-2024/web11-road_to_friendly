import { css, keyframes } from '@emotion/react';
import closeIcon from '../../assets/icons/close.svg';
import { useTimeout } from '../../hooks';

type Position = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};

type ToastProps = {
  //icon: React.FC<React.SVGProps<SVGSVGElement>>;
  icon: string;
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

  //font: 'var(--font-medium-16)',
  fontSize: '16px',
  color: '#ffffff',
  backgroundColor: '#000000'
});

export default function Toast({
  icon,
  text,
  setToast,
  duration = 1750,
  position = { bottom: '1.5rem', left: '50%' }
}: ToastProps) {
  const [timeover, setTimeover] = useTimeout(duration);

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
      <img src={icon} />
      <div css={{ display: 'flex', justifyContent: 'space-between', flex: '1' }}>
        {text}
        <button
          css={{ width: '1.25rem', cursor: 'pointer', backgroundColor: 'transparent', ':focus': { outline: 'none' } }}
          onClick={() => setTimeover(true)}
        >
          <img src={closeIcon} />
        </button>
      </div>
    </div>
  );
}
