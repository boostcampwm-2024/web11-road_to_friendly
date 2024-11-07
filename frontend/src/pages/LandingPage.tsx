import { hoverGrowJumpAnimation } from '../styles';
import { Variables } from '../styles/Variables';
import { css } from '@emotion/react';
import { Header, Toast } from '../components/common/';
import clapImage from '../assets/landing-clap.png';
import CheckIcon from '../assets/icons/check.svg?react';
import { useState } from 'react';
import RoomCreateButton from '../components/RoomCreateButton';

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
  const [toast, setToast] = useState(false);
  return (
    <>
      <Header />
      <div css={backgroundStyle}>
        {toast && (
          <Toast
            icon={() => <CheckIcon css={{ fill: Variables.colors.text_word_weak }} />}
            text="서버와 통신 중 에러가 발생했습니다!"
            setToast={setToast}
          />
        )}
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