import { useState, useEffect } from 'react';

import { FADE_OUT_DELAY, CONTENT_SHARE_DELAY } from '@/constants/time';

export const useViewState = () => {
  const [isResultView, setIsResultView] = useState(false); //결과 페이지 여부
  const [isResultInstructionVisible, setIsResultInstructionVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false); // 페이드아웃 상태
  const [isContentShareVisible, setIsContentShareVisible] = useState(false);
  const [isIntroViewActive, setIsIntroViewActive] = useState(true);

  const endIntroView = () => setIsIntroViewActive(false);

  useEffect(() => {
    if (isResultView) {
      setIsResultInstructionVisible(true);
      // 5초 후 페이드아웃 시작
      // 로딩이 3초
      const fadeOutTimer = setTimeout(() => setIsFadingOut(true), FADE_OUT_DELAY);

      // 페이드아웃 1초 후 ContentShareView 표시
      const showContentTimer = setTimeout(() => {
        setIsResultInstructionVisible(false);
        setIsContentShareVisible(true);
      }, CONTENT_SHARE_DELAY);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(showContentTimer);
      };
    }
  }, [isResultView]);

  const startResultPage = () => setIsResultView(true);

  return {
    isIntroViewActive,
    isResultView,
    isResultInstructionVisible,
    isFadingOut,
    isContentShareVisible,
    startResultPage,
    endIntroView
  };
};
