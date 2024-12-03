import {
  YOUTUBE_LONG_URL_REGEX,
  YOUTUBE_PLAYLIST_URL_REGEX,
  YOUTUBE_SHORTS_URL_REGEX,
  YOUTUBE_SHORTS_URL_SIMPLE_REGEX,
  YOUTUBE_SHORT_URL_REGEX,
  YOUTUBE_SHORT_URL_WITH_TIMESTAMP_REGEX
} from '@/constants/youtube';

export const checkYoutubeURLValidation = (url: string) => {
  const regexes = [
    YOUTUBE_LONG_URL_REGEX,
    YOUTUBE_SHORT_URL_REGEX,
    YOUTUBE_SHORT_URL_WITH_TIMESTAMP_REGEX,
    YOUTUBE_PLAYLIST_URL_REGEX,
    YOUTUBE_SHORTS_URL_REGEX,
    YOUTUBE_SHORTS_URL_SIMPLE_REGEX
  ];

  return regexes.some((regex) => regex.test(url));
};

export const getYoutubeEmbedURL = (URL: string) => {
  // 유효한 URL일 때
  const longUrlMatch = URL.match(YOUTUBE_LONG_URL_REGEX);
  const shortUrlMatch = URL.match(YOUTUBE_SHORT_URL_REGEX);
  const timestampUrlMatch = URL.match(YOUTUBE_SHORT_URL_WITH_TIMESTAMP_REGEX);
  const playlistUrlMatch = URL.match(YOUTUBE_PLAYLIST_URL_REGEX);
  const shortsUrlMatch = URL.match(YOUTUBE_SHORTS_URL_REGEX);
  const shortsUrlSimpleMatch = URL.match(YOUTUBE_SHORTS_URL_SIMPLE_REGEX);

  if (longUrlMatch) {
    // 긴 URL https://www.youtube.com/watch?v=FFdHMm9dHbQ
    return `https://www.youtube.com/embed/${longUrlMatch[1]}`;
  }

  if (shortUrlMatch) {
    // 짧은 URL https://youtu.be/FFdHMm9dHbQ
    return `https://www.youtube.com/embed/${shortUrlMatch[1]}`;
  }

  if (timestampUrlMatch) {
    // 재생 시점 지정된 URL https://youtu.be/FFdHMm9dHbQ?t=2
    return `https://www.youtube.com/embed/${timestampUrlMatch[1]}?t=${timestampUrlMatch[2]}`;
  }

  if (playlistUrlMatch) {
    // 재생목록에 있는 URL https://www.youtube.com/watch?v=ds-FowwO9Lg&list=PLUud9rWUXUuWLmZy_ykyuaqrkfTymPjpP
    return `https://www.youtube.com/embed/${playlistUrlMatch[1]}?playlist=${playlistUrlMatch[2]}`;
  }

  if (shortsUrlMatch || shortsUrlSimpleMatch) {
    // YouTube 쇼츠 URL https://www.youtube.com/shorts/n2DcpqDK8C0
    return `https://www.youtube.com/embed/${shortsUrlMatch ? shortsUrlMatch[1] : shortsUrlSimpleMatch[1]}`;
  }

  // 매칭되지 않으면 빈 문자열 반환
  return '';
};

export const isShorts = (URL: string) => {
  const shortsUrlMatch = URL.match(YOUTUBE_SHORTS_URL_REGEX);
  const shortsUrlSimpleMatch = URL.match(YOUTUBE_SHORTS_URL_SIMPLE_REGEX);

  if (shortsUrlMatch || shortsUrlSimpleMatch) return true;
  return false;
};
