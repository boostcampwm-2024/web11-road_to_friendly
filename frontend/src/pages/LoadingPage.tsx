import { css } from '@emotion/react';
import { LoadingSpinnerWave } from '../components/common';
import { Variables } from '../styles';

const loadingPageStyle = css({
  width: '100vw',
  height: '100vh',

  display: 'flex',
  gap: '2rem',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
});

const LoadingPage = () => {
  return (
    <div css={loadingPageStyle}>
      <div css={{ position: 'relative' }}>
        <LoadingSpinnerWave />
      </div>
      <p css={{ font: Variables.typography.font_medium_16, color: Variables.colors.text_alt }}>
        관심사를 나누러 가는 중...
      </p>
    </div>
  );
};

export default LoadingPage;
