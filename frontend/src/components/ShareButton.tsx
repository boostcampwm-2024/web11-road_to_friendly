import { css } from '@emotion/react';

import LinkIcon from '@/assets/icons/link.svg?react';
import { useToast } from '@/hooks';
import { hoverGrowJumpAnimation, Variables } from '@/styles';

function copyCurrentLink(callback: Function) {
  const currentUrl = window.location.href;
  navigator.clipboard.writeText(currentUrl).then(() => {
    callback();
  });
}

const ShareButton = () => {
  const { openToast } = useToast();
  return (
    <button
      css={[shareButtonStyle, hoverGrowJumpAnimation({ scale: 1.03, height: '0.6rem' })]}
      onClick={() => copyCurrentLink(() => openToast({ text: '초대 링크가 복사되었습니다!', duration: 1250 }))}
    >
      <LinkIcon />
      링크로 초대하기
    </button>
  );
};

export default ShareButton;

const shareButtonStyle = css({
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',

  width: '180px',
  borderRadius: '1.75rem',
  padding: '1rem',

  position: 'fixed',
  bottom: '2rem',
  right: '2rem',

  font: Variables.typography.font_medium_16,
  color: Variables.colors.text_default,
  backgroundColor: Variables.colors.surface_white,
  fill: Variables.colors.text_point,
  filter: `drop-shadow(${Variables.shadow.shadow_floating})`
});
