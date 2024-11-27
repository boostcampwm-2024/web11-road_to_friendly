export const MIN_SHORT_RADIUS = 210; //반지름
export const MIN_LONG_RADIUS = Math.floor((MIN_SHORT_RADIUS * 4) / 3); //장축:단축 = 4:3
export const MAX_SHORT_RADIUS = 220;
export const MAX_LONG_RADIUS = Math.floor((MAX_SHORT_RADIUS * 4) / 3);

export const BIG_THRESHOLD = 20;
export const MIDEIUM_THRESHOLD = 40;
export const SMALL_THRESHOLD = 60;

export const YOUTUBE_ERROR_MESSAGES = {
  NO_PLAYER: '플레이어 구성 중 문제가 발생해서 공유자와 화면을 동기화할 수 없어요!'
} as const;
