// 긴 URL: https://www.youtube.com/watch?v=FFdHMm9dHbQ
export const YOUTUBE_LONG_URL_REGEX = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;

// 짧은 URL: https://youtu.be/FFdHMm9dHbQ
export const YOUTUBE_SHORT_URL_REGEX = /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/;

// 영상 재생 시점을 지정한 URL: https://youtu.be/FFdHMm9dHbQ?t=2
export const YOUTUBE_SHORT_URL_WITH_TIMESTAMP_REGEX = /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)\?t=\d+/;

// 재생 목록에 있는 영상 URL: https://www.youtube.com/watch?v=ds-FowwO9Lg&list=PLUud9rWUXUuWLmZy_ykyuaqrkfTymPjpP
export const YOUTUBE_PLAYLIST_URL_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)&list=([a-zA-Z0-9_-]+)/;

// 쇼츠 URL: https://www.youtube.com/shorts/n2DcpqDK8C0?feature=share
export const YOUTUBE_SHORTS_URL_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]+)\??[a-zA-Z0-9_=&-]*/;

// 쇼츠 우클릭 후 복사한 URL: https://www.youtube.com/shorts/n2DcpqDK8C0
export const YOUTUBE_SHORTS_URL_SIMPLE_REGEX = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/;

export const YOUTUBE_ERROR_MESSAGES = {
  NO_PLAYER: '플레이어 구성 중 문제가 발생해서 공유자와 화면을 동기화할 수 없어요!'
} as const;
