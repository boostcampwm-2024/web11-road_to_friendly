import { css } from '@emotion/react';

import { Header } from '@/components/common/';
import RoomCreateButton from '@/components/RoomCreateButton';

import clapImage from '@/assets/landing-clap.png';
import { Variables } from '@/styles';

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
            <RoomCreateButton />
          </div>
          <img src={clapImage} alt="Vite Logo" width={400} height={400} />
        </section>
      </div>
    </>
  );
};

export default LandingPage;
