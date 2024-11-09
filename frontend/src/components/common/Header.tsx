import { css } from '@emotion/react';

import { Variables } from '@/styles';

const headerWrapperStyle = css({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  width: '100%',
  padding: 24
});

const headerStyle = (paddingY: number) =>
  css({
    backgroundColor: Variables.colors.surface_white,
    width: '100%',
    borderRadius: 999,
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${paddingY}px 32px`,
    alignItems: 'center',
    boxShadow: '0 0 30px #00000008'
  });

const navStyle = css({
  display: 'flex',
  gap: 24,
  color: Variables.colors.text_weak,
  font: Variables.typography.font_medium_20
});

interface HeaderProps {
  paddingY?: number;
}

const Header = ({ paddingY = 24 }: HeaderProps) => {
  return (
    <header css={headerWrapperStyle}>
      <div css={headerStyle(paddingY)}>
        <a css={{ font: Variables.typography.font_bold_24 }} href="/">
          친해지길
        </a>
        <nav css={navStyle}>
          <button>튜토리얼</button>
          <button>라이트/다크</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
