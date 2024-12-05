export const MIN_SHORT_RADIUS = Math.floor(window.innerHeight * 0.3); // 화면 높이의 30%로 최소 반지름 설정
export const MIN_LONG_RADIUS = Math.floor((MIN_SHORT_RADIUS * 4) / 3); // 비율에 맞춰 장축 계산

export const MAX_SHORT_RADIUS = Math.floor(window.innerHeight * 0.35); // 화면 높이의 35%로 최대 반지름 설정
export const MAX_LONG_RADIUS = Math.floor((MAX_SHORT_RADIUS * 4) / 3); //장축:단축 = 4:3

export const BIG_THRESHOLD = 20;
export const MIDEIUM_THRESHOLD = 40;
export const SMALL_THRESHOLD = 60;
