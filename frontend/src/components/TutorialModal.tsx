import { css } from '@emotion/react';
import { useEffect, useRef } from 'react';
import { useIndex } from '@/hooks';
import { TextSeparate } from './common';
import { flexStyle, Variables } from '@/styles';
import LeftArrowIcon from '@/assets/icons/arrow-left-wide-line.svg?react';
import RightArrowIcon from '@/assets/icons/arrow-right-wide-line.svg?react';
import XIcon from '@/assets/icons/closeX.svg?react';
import enterWebm from '@/assets/webm/enter.webm';
import wordcloudWebm from '@/assets/webm/wordcloud2.webm';
import contentShareWebm from '@/assets/webm/content.webm';

interface TutorialModalProps {
  closeModal: () => void;
}

interface Content {
  webm: string;
  title: string;
  text: string;
}

const MODAL_MIN_WIDTH = '35rem';

const VIDEO_MIN_WIDTH = '30rem';
const VIDEO_MAX_WIDTH = '35rem';

const VIDEO_MIN_HEIGHT = '23.8rem';
const VIDEO_MAX_HEIGHT = '23.8rem';

const pageContents = [
  {
    webm: enterWebm,
    title: `동료들과 함께 할 수 있어요`,
    text: `친해지길에서는 여러 사용자들과 하나의 방에 모일 수 있어요.
    또한, 나의 닉네임을 바꿔 개성을 표현할 수 있어요.`
  },
  {
    webm: wordcloudWebm,
    title: `가벼운 아이스브레이킹 질문들에 실시간으로 답변하며 서로의 관심사를 파악해 보세요`,
    text: `모든 사용자들의 답변을 실시간으로 확인하고 공감을 표시하며, 어떤 게 인기있는 답변일지 확인할 수 있어요!`
  },
  {
    webm: contentShareWebm,
    title: '서로의 관심사를 파악했다면 다함께 다양한 컨텐츠들을 실시간으로 공유하며 친해져봐요!',
    text: '우리 팀이 다같이 즐길 수 있는 것도, 내가 추천하고 싶은 것도 좋아요. 이미지 또는 유튜브 컨텐츠를 공유할 수 있어요.'
  }
];

const TutorialModal = ({ closeModal }: TutorialModalProps) => {
  const [page, addPage, subPage] = useIndex(pageContents.length, 0, false);

  const isFirst = page === 0;
  const isLast = page === pageContents.length - 1;

  return (
    <div css={tutorialModalStyle}>
      <button
        css={arrowButtonStyle}
        style={{ left: '-1.5rem', opacity: isFirst ? 0 : 1, pointerEvents: isFirst ? 'none' : 'auto' }}
        onClick={(e) => subPage()}
      >
        <LeftArrowIcon />
      </button>
      <div css={headerStyle}>
        <div css={titleStyle}> 친해지길은 이런 서비스에요! </div>
        <button css={{ width: '1rem', fill: Variables.colors.surface_strong }} onClick={(e) => closeModal()}>
          <XIcon />
        </button>
      </div>
      <Content {...pageContents[page]} />
      <button
        css={arrowButtonStyle}
        style={{ right: '-1.5rem', opacity: isLast ? 0 : 1, pointerEvents: isLast ? 'none' : 'auto' }}
        onClick={(e) => addPage()}
      >
        <RightArrowIcon />
      </button>
    </div>
  );
};

const Content = ({ webm, title, text }: Content) => {
  const videoRef = useRef<HTMLVideoElement>();

  useEffect(() => {
    if (videoRef.current) videoRef.current.load();
  }, [webm]);

  return (
    <div css={contentContainerStyle}>
      <video autoPlay loop muted playsInline css={videoStyle} ref={videoRef}>
        <source src={webm} type="video/webm" />
      </video>
      <div css={textBoxStyle}>
        <div css={{ font: Variables.typography.font_bold_24, color: Variables.colors.text_white }}>{title}</div>
        <div css={textContainerStyle}>
          <TextSeparate text={text} />
        </div>
      </div>
    </div>
  );
};

const tutorialModalStyle = css(
  {
    position: 'relative',
    padding: '0.25rem 3rem 1.5rem 3rem',
    minWidth: MODAL_MIN_WIDTH,
    transition: 'height 0.3s ease, height 0.3s ease'
  },
  flexStyle(24, 'column', 'center')
);

const titleStyle = css({
  font: Variables.typography.font_bold_24,
  flex: 1,
  textAlign: 'center'
});

const headerStyle = css(
  {
    width: '100%'
  },
  flexStyle(0, 'row', 'space-between')
);

const videoStyle = css({
  minWidth: VIDEO_MIN_WIDTH,
  maxWidth: VIDEO_MAX_WIDTH,
  minHeight: VIDEO_MIN_HEIGHT,
  maxHeight: VIDEO_MAX_HEIGHT,
  backgroundColor: Variables.colors.surface_black
});

const arrowButtonStyle = css({
  position: 'absolute',
  bottom: '50%',
  transform: 'translateY(50%)',
  fill: Variables.colors.surface_strong,
  width: '3.5rem',
  height: '5.5rem',
  transition: 'opacity 0.1s ease'
});

const textBoxStyle = css(
  {
    padding: '1.75rem 2rem 2.5rem 2rem',
    background: `linear-gradient(90deg, #ff9191, #ffa286)`,
    width: '100%'
  },
  flexStyle(24, 'column', 'normal', 'normal')
);

const contentContainerStyle = css(
  {
    borderRadius: '1rem',
    overflow: 'hidden',
    filter: `drop-shadow(${Variables.shadow.shadow_floating})`,
    maxWidth: VIDEO_MAX_WIDTH
  },
  flexStyle(0, 'column', 'center')
);

const textContainerStyle = css(
  {
    font: Variables.typography.font_medium_16,
    color: Variables.colors.text_transparent_white_70
  },
  flexStyle(8, 'column', 'normal', 'normal')
);

export default TutorialModal;
