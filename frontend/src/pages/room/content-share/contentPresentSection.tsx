import { css } from '@emotion/react';

import { Content } from '@/types';

const ContentPresentSectionStyle = css({
  flexGrow: 1,
  width: '100%',
  height: '100%', // 부모 컨테이너의 높이 추가
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center', // 이미지 가운데 정렬
  overflow: 'hidden', // 이미지가 넘칠 경우 숨김
  backgroundColor: '#f6f6f6',
  borderRadius: 24
});

const ImageContentStyle = css({
  width: '100%',
  height: '100%',
  objectFit: 'contain', // 부모 영역 안에 맞추되 비율 유지
  borderRadius: 24
});

interface ContentPresentSectionProps {
  content: Content;
}

/* 컨텐츠가 실제로 표시되는 영역 */
const ContentPresentSection = ({ content }: ContentPresentSectionProps) => {
  return (
    <div css={ContentPresentSectionStyle}>
      <img
        css={ImageContentStyle}
        src={'https://i1.sndcdn.com/artworks-nS5zU2ZseiW3oRgT-PjrnSw-t500x500.jpg'}
        alt={'content'}
      />
    </div>
  );
};

export default ContentPresentSection;
