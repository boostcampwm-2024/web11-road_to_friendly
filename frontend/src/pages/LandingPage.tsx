import { Variables } from '../styles/Variables';
import { css } from '@emotion/react';
import { Header } from '../components/common/';
import clapImage from '../assets/landing-clap.png';

const backgroundStyle = css`
  background:
    linear-gradient(to top left, #b4fff6, rgba(255, 153, 150, 0), #f3b6a1),
    linear-gradient(to top right, #ffe7ac, rgba(255, 153, 150, 0), #d9aacc) #ebe4e4;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const startButtonStyle = css({
  font: Variables.typography.font_bold_24,
  color: Variables.colors.text_white,
  backgroundColor: Variables.colors.surface_point,
  padding: '24px 48px',
  borderRadius: 32,
  ':hover': {
    opacity: 0.8
  }
});

const headingTextStyle = css({ font: Variables.typography.font_bold_72, color: Variables.colors.text_default });

const LandingPage = () => {
  return (
    <>
      <Header />
      <div css={backgroundStyle}>
        <section css={{ display: 'flex', alignItems: 'center', margin: 'auto 0', gap: 100 }}>
          <div css={{ display: 'flex', flexDirection: 'column', gap: 66 }}>
            <h1 css={headingTextStyle}>
              간편하게
              <br />
              팀원들과
              <br />
              친해져봐요
            </h1>
            <button css={startButtonStyle}>공감 포인트 나누기 시작하기</button>
          </div>
          <img src={clapImage} alt="Vite Logo" width={400} height={400} />
        </section>
      </div>
    </>
  );
};

export default LandingPage;
