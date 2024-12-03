import { css } from '@emotion/react';

import { Player } from '@/components';
import { useSocketStore } from '@/stores';
import { Content } from '@/types';
import { isShorts } from '@/utils';

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
  prevVolumeRef?: React.MutableRefObject<number | null>;
}

/* 컨텐츠가 실제로 표시되는 영역 */
const ContentPresentSection = ({ content, prevVolumeRef }: ContentPresentSectionProps) => {
  const { socket } = useSocketStore();
  const isSharer = content.sharerSocketId === socket.id;

  const parseIfPlaylistURL = (url: string) => {
    const playlistPattern = /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]+&list=[\w-]+/;
    return playlistPattern.test(url) ? url.slice(0, url.indexOf('&list=')) : url;
  };

  return (
    <>
      {content.type === 'IMAGE' && (
        <div css={ContentPresentSectionStyle}>
          <img css={ImageContentStyle} src={content.resourceURL} alt={'content'} />
        </div>
      )}
      {content.type === 'YOUTUBE' && (
        <div css={ContentPresentSectionStyle}>
          <Player
            url={parseIfPlaylistURL(content.resourceURL)}
            isSharer={isSharer}
            isShorts={isShorts(content.resourceURL)}
            prevVolumeRef={prevVolumeRef}
          />
        </div>
      )}
    </>
  );
};

export default ContentPresentSection;
