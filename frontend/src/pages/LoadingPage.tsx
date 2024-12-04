import { css } from '@emotion/react';

import { LoadingSpinnerWave } from '@/components/common';

import { Variables } from '@/styles';

interface LoadingPageProps {
  isAnalyzing?: boolean; //분석 페이지 여부
  loadingMessage?: string;
}
const LoadingPage = ({ isAnalyzing = false, loadingMessage }: LoadingPageProps) => {
  return (
    <div css={loadingPageStyle}>
      {isAnalyzing && (
        <p css={{ font: Variables.typography.font_medium_18, color: Variables.colors.text_default }}>
          공감 포인트 모으기가 끝났어요.
          <br />
          조금만 기다리시면 통계를 확인하거나 컨텐츠를 공유할 수 있어요.
        </p>
      )}
      <div css={{ position: 'relative' }}>
        <LoadingSpinnerWave />
      </div>
      {loadingMessage && (
        <p css={{ font: Variables.typography.font_medium_16, color: Variables.colors.text_alt }}>{loadingMessage}</p>
      )}
    </div>
  );
};

export default LoadingPage;

const loadingPageStyle = css({
  width: '100vw',
  height: '100vh',

  display: 'flex',
  gap: '2rem',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center'
});
