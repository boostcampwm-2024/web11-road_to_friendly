import { css } from '@emotion/react';

import LinkIcon from '@/assets/icons/link.svg?react';
import { hoverGrowJumpAnimation, Variables } from '@/styles';

import { useToast } from '@/hooks';

const shareButtonStyle = css({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',

  width: '12rem',
  borderRadius: '1.75rem',
  padding: '1rem',

  position: 'fixed',
  bottom: '3rem',
  right: '4rem',

  font: Variables.typography.font_medium_16,
  color: Variables.colors.text_default,
  backgroundColor: Variables.colors.surface_white,
  fill: Variables.colors.text_point,
  filter: `drop-shadow(${Variables.shadow.shadow_floating})`
});

function copyCurrentLink(callback: Function) {
  const currentUrl = window.location.href;
  navigator.clipboard.writeText(currentUrl).then(() => {
    callback();
  });
}

const ShareButton = () => {
  const { openToast } = useToast();
  return (
    <>
      <button
        css={[shareButtonStyle, hoverGrowJumpAnimation({ scale: 1.03, height: '0.6rem' })]}
        onClick={() => copyCurrentLink(() => openToast({ text: '초대 링크가 복사되었습니다!', duration: 1250 }))}
      >
        <LinkIcon />
        링크로 초대하기
      </button>
    </>
  );
};

export default ShareButton;
