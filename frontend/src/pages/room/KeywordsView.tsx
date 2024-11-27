import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';

import { BIG_THRESHOLD, MIDEIUM_THRESHOLD, SMALL_THRESHOLD } from '@/constants';
import { useToast } from '@/hooks';
import { sendPickKeywordMessage, sendReleaseKeywordMessage } from '@/services';
import { useSocketStore } from '@/stores';
import { useKeywordsStore } from '@/stores/keywords';
import { keywordStyleMap, scaleIn, Variables } from '@/styles';
import { Group, Keyword, KeywordsCoordinates, PrefixSum } from '@/types';

const KeywordsViewContainer = css`
  width: 150%;
  height: 400px;
  margin-top: 20px;
  position: relative;
`;

// 좌표 계산을 위한 보이지 않는 컨테이너
const HiddenKeywordsContainer = css`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px solid black;
  position: absolute;
  overflow: hidden;
  opacity: 0%;
  z-index: 1;
`;

const RealKeywordsContainer = css`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 100%;
  z-index: 2;
`;

const KeywordStyle = css`
  position: absolute;
  border: 1px solid black;
  height: fit-content;
  padding: 0.5rem 0.75rem;
  background: ${Variables.colors.surface_word_default};
  text-align: center;
  min-width: 60px;
  transition: all 0.3s ease;
  transform: scale(0); // 초기 스케일 값 0
  animation: ${scaleIn} 0.3s forwards; // keyframes 애니메이션 호출
  cursor: pointer;
`;

interface KeywordsViewProps {
  questionId: number;
  selectedKeywords: Set<string>;
  updateSelectedKeywords: (keyword: string, type: 'add' | 'delete') => void;
}

function getKeywordGroup(keyword: Keyword, keywordCountSum: number, prefixSum: PrefixSum): Group {
  const { count } = keyword;
  const curPrefixSum = prefixSum[count];
  const ratio = Math.ceil((curPrefixSum / keywordCountSum) * 100);

  if (ratio < BIG_THRESHOLD) {
    return 'Big';
  } else if (ratio < MIDEIUM_THRESHOLD) {
    return 'Medium';
  } else if (ratio < SMALL_THRESHOLD) {
    return 'Small';
  }
  return 'Tiny';
}

const KeywordsView = ({ questionId, selectedKeywords, updateSelectedKeywords }: KeywordsViewProps) => {
  const { socket } = useSocketStore();
  const { openToast } = useToast();
  const { keywords, prefixSumMap, upsertKeyword } = useKeywordsStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [keywordsCoordinates, setKeywordsCoordinates] = useState<KeywordsCoordinates>({});

  useEffect(() => {
    if (socket) {
      socket.off('empathy:keyword:count');

      socket.on('empathy:keyword:count', (response: { questionId: number; keyword: string; count: number }) => {
        upsertKeyword(response);
      });
    }

    return () => {
      socket?.off('empathy:keyword:count');
    };
  }, [socket]);

  // 키워드 배열 업데이트될 때마다 워드 클라우드 그리기
  useEffect(() => {
    const container = containerRef.current;
    const wordArray = keywords[questionId] || [];
    if (!container || wordArray.length === 0) return;

    // 컨테이너 초기화
    container.innerHTML = '';

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const containerCenterX = containerWidth / 2.0;
    const containerCenterY = containerHeight / 2.0;
    const containerAspectRatio = containerWidth / containerHeight;

    const hitTest = (elem: HTMLElement, other_elems: HTMLElement[]): boolean => {
      const overlapTest = (a: HTMLElement, b: HTMLElement, gap: number) => {
        if (
          Math.abs(a.offsetLeft + a.offsetWidth / 2 - b.offsetLeft - b.offsetWidth / 2) <
          a.offsetWidth / 2 + b.offsetWidth / 2 + gap
        ) {
          if (
            Math.abs(a.offsetTop + a.offsetHeight / 2 - b.offsetTop - b.offsetHeight / 2) <
            a.offsetHeight / 2 + b.offsetHeight / 2 + gap
          ) {
            return true;
          }
        } else {
          return false;
        }
      };

      let i = 0;
      for (i = 0; i < other_elems.length; i++) {
        if (overlapTest(elem, other_elems[i], 4)) return true;
      }
      return false;
    };

    const alreadyPlacedWords: HTMLElement[] = [];

    const drawOneWord = (index: number, word: Keyword) => {
      const wordId = `word-${index}`;
      let angle = Math.random() * Math.PI * 2;
      let radius = 0.0;
      const step = 2.0;
      let weight = 1;
      const customClass = '';
      const innerHTML = '';
      const wordSpan: HTMLSpanElement = document.createElement('span');

      wordSpan.setAttribute('id', wordId);

      if (wordArray[0].count > wordArray[wordArray.length - 1].count) {
        weight =
          Math.round(
            ((word.count - wordArray[wordArray.length - 1].count) /
              (wordArray[0].count - wordArray[wordArray.length - 1].count)) *
              3
          ) + 1;
      }
      wordSpan.innerHTML = word.keyword;

      // TODO: 클릭 핸들러 붙이기
      wordSpan.addEventListener('click', () => {});

      const width = wordSpan.offsetWidth;
      const height = wordSpan.offsetHeight;
      let left = containerCenterX - width / 2;
      let top = containerCenterY - height / 2;

      const wordSpanStyle = `
        position: absolute;
        left: ${left}px;
        top: ${top}px;
        border: 1px solid black;
        font-size: ${weight < 2 ? 16 : weight * 12}px;
        padding: 0.35rem 0.75rem;
        background: ${Variables.colors.surface_word_default};
        text-align: center;
        min-width: 60px;
        transition: font-size 0.3s ease;
      `;

      wordSpan.style.cssText = wordSpanStyle;
      container.appendChild(wordSpan);

      while (hitTest(wordSpan, alreadyPlacedWords)) {
        radius += step;
        angle += (index % 2 === 0 ? 1 : -1) * step;
        left = containerCenterX - width / 2 + radius * Math.cos(angle) * containerAspectRatio;
        top = containerCenterY + radius * Math.sin(angle) - height / 2.0;
        wordSpan.style.left = `${left}px`;
        wordSpan.style.top = `${top}px`;
      }

      // 컨테이너를 벗어나는 단어는 제거
      if (left < 0 || top < 0 || left + width > containerWidth || top + height > containerHeight) {
        container.removeChild(wordSpan);
        return;
      }

      // 첫번째 키워드를 정중앙에 위치시키기 위해 조정
      if (index === 0) {
        left -= wordSpan.offsetWidth / 2;
        top -= wordSpan.offsetHeight / 2;
        wordSpan.style.left = `${left}px`;
        wordSpan.style.top = `${top}px`;
      }

      alreadyPlacedWords.push(wordSpan);
      setKeywordsCoordinates((prev) => ({
        ...prev,
        [word.keyword]: { x: left, y: top, count: word.count }
      }));
    };

    wordArray.forEach((word, index) => {
      drawOneWord(index, word);
    });
  }, [keywords[questionId]]);

  const pickKeyword = async (keyword: string) => {
    if (!socket) return;
    try {
      await sendPickKeywordMessage(socket, questionId, keyword); // 서버에 키워드 공감 요청
      updateSelectedKeywords(keyword, 'add');
      openToast({ text: '키워드에 공감을 표시했어요!', type: 'check' });
    } catch (error) {
      if (error instanceof Error) openToast({ text: error.message, type: 'error' });
    }
  };

  const unpickKeyword = async (keyword: string) => {
    if (!socket) return;
    try {
      await sendReleaseKeywordMessage(socket, questionId, keyword); // 서버에 키워드 공감 취소 요청
      updateSelectedKeywords(keyword, 'delete');
      openToast({ text: '키워드 공감을 취소했어요', type: 'check' });
    } catch (error) {
      if (error instanceof Error) openToast({ text: error.message, type: 'error' });
    }
  };

  return (
    <div css={KeywordsViewContainer}>
      <div css={HiddenKeywordsContainer} ref={containerRef}></div>
      <div css={RealKeywordsContainer}>
        {Object.keys(keywordsCoordinates).map((keyword) => {
          const keywordObject: Keyword = { keyword, count: keywordsCoordinates[keyword].count };
          return (
            <div
              key={`${questionId}-${keyword}`}
              css={[
                KeywordStyle,
                keywordStyleMap(selectedKeywords.has(keyword))[
                  getKeywordGroup(keywordObject, Object.keys(keywordsCoordinates).length, prefixSumMap[questionId])
                ],
                {
                  left: keywordsCoordinates[keyword].x,
                  top: keywordsCoordinates[keyword].y
                }
              ]}
              onClick={() => {
                selectedKeywords.has(keyword) ? unpickKeyword(keyword) : pickKeyword(keyword);
              }}
            >
              {keywordObject.keyword}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KeywordsView;
