import { css, keyframes } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';

import ClockIcon from '@/assets/icons/clock.svg?react';
import { QuestionInput } from '@/components';
import { MAX_LONG_RADIUS } from '@/constants';
import { useToast } from '@/hooks';
import { useParticipantsStore, useQuestionsStore, useSocketStore, useKeywordsStore, useRadiusStore } from '@/stores/';
import { flexStyle, Variables, fadeIn, fadeOut } from '@/styles';
import { Question, CommonResult } from '@/types';
import { getRemainingSeconds } from '@/utils';
import TimerWorker from '@/workers/timerWorker.js?worker';

import KeywordsView from './KeywordsView';

const MainContainer = css([{ width: '100%' }, flexStyle(5, 'column')]);

const viewContainerStyle = (isFadeIn: boolean) => css`
  width: ${MAX_LONG_RADIUS * 1.5}px;
  animation: ${isFadeIn ? fadeIn : fadeOut} 0.5s ease;
  opacity: ${isFadeIn ? 1 : 0};
  ${flexStyle(8, 'column')}
`;

const moveUp = keyframes`
  to {
    transform: translate(-50%, -40px)
  }
`;

const questionTitleStyle = (isQuestionMovedUp: boolean) =>
  css({
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    font: Variables.typography.font_bold_32,
    marginBottom: Variables.spacing.spacing_sm,
    animation: `${isQuestionMovedUp ? moveUp : 'none'} 1s ease forwards`
  });

const progressWrapperStyle = css([
  {
    width: '100%'
  },
  flexStyle(8, 'row')
]);

const progressBarStyle = css`
  width: 100%;
  height: 12px;
  border-radius: 50px;
  background-color: #eee;

  ::-webkit-progress-bar {
    background-color: ${Variables.colors.surface_alt};
    border-radius: 50px;
    height: 12px;
    overflow: hidden;
  }

  ::-webkit-progress-value {
    background-color: ${Variables.colors.surface_strong};
    border-radius: 50px;
    height: 12px;
  }
`;

interface QuestionViewProps {
  onQuestionStart: () => void;
  onLastQuestionComplete: () => void;
  finishResultLoading: () => void;
  startResultLoading: () => void;
}

const QuestionsView = ({
  onQuestionStart,
  onLastQuestionComplete,
  finishResultLoading,
  startResultLoading
}: QuestionViewProps) => {
  const { socket } = useSocketStore();
  const { questions, setQuestions } = useQuestionsStore();
  const { setStatisticsKeywords } = useKeywordsStore();
  const { setParticipants } = useParticipantsStore();
  const { openToast } = useToast();
  const { setOutOfBounds } = useRadiusStore();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTimeLeft, setInitialTimeLeft] = useState(0);
  const [isFadeIn, setIsFadeIn] = useState(true);
  const [isQuestionMovedUp, setIsQuestionMovedUp] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [resultResponse, setResultResponse] = useState<CommonResult | null>(null);

  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const updateSelectedKeywords = (keyword: string, type: 'add' | 'delete') => {
    if (type === 'add') {
      setSelectedKeywords((prev) => new Set(prev.add(keyword)));
    } else {
      setSelectedKeywords((prev) => {
        prev.delete(keyword);
        return new Set(prev);
      });
    }
  };
  const resetSelectedKeywords = () => setSelectedKeywords(new Set());

  // 웹 워커 생성
  const timerWorker = useRef(null);

  useEffect(() => {
    if (!timerWorker.current) {
      timerWorker.current = new TimerWorker();

      timerWorker.current.onmessage = (e) => {
        if (e.data === 'tick') {
          setTimeLeft((prev) => Math.max(prev - 1, 0));
        }
      };
    }

    return () => {
      if (timerWorker.current) {
        timerWorker.current.terminate();
        timerWorker.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (currentQuestionIndex >= 0 && timeLeft === 0 && initialTimeLeft > 0) {
      setIsFadeIn(false);
      setIsQuestionMovedUp(false);
      setShowInput(false);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (socket) {
      socket.on('empathy:start', (response: { questions: Question[] }) => {
        setQuestions(response.questions);
        onQuestionStart();
        if (response.questions.length > 0) {
          const firstQuestionTimeLeft = getRemainingSeconds(new Date(response.questions[0].expirationTime), new Date());
          setTimeLeft(firstQuestionTimeLeft);
          setInitialTimeLeft(firstQuestionTimeLeft);
        }
      });

      if (socket && socket.connected) {
        const handleResult = (response: CommonResult) => {
          // 통계결과를 임시로 저장
          console.log('empathy:result received: ', response);
          setResultResponse(response);
        };
        socket.on('empathy:result', handleResult);
      }
    }
  }, [socket, setQuestions, onQuestionStart]);

  const startTimer = (duration: number) => {
    setTimeLeft(duration);
    setInitialTimeLeft(duration);
    timerWorker.current?.postMessage({ action: 'start', interval: 1000 });
  };

  useEffect(() => {
    if (currentQuestionIndex >= questions.length) {
      timerWorker.current?.postMessage({ action: 'stop' }); // 타이머 중지

      if (questions.length > 0) {
        //마지막 질문이 끝나고 로딩 시작
        onLastQuestionComplete();
        startResultLoading();

        if (resultResponse) {
          // 통계 데이터 처리
          setStatisticsKeywords(resultResponse);
          Object.entries(resultResponse).forEach(([userId, array]) => {
            setParticipants((prev) => ({ ...prev, [userId]: { ...prev[userId], keywords: array } }));
          });
        } else {
          openToast({ type: 'error', text: '통계 분석 중 오류가 발생했습니다. 다시 시도해주세요' });
        }

        finishResultLoading();
        setOutOfBounds(false); //사용자 ui 원위치로
      }

      return;
    }

    resetSelectedKeywords(); // 새 질문으로 전환되면 선택된 키워드 초기화

    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const nextTimeLeft = getRemainingSeconds(new Date(questions[currentQuestionIndex].expirationTime), new Date());
      setInitialTimeLeft(nextTimeLeft);
      setTimeLeft(nextTimeLeft);
      startTimer(nextTimeLeft - 1);
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    const questionTimer = setTimeout(() => {
      setIsQuestionMovedUp(true); // 질문이 위로 이동
      setShowInput(true); // 입력 창 표시
    }, 1000);

    return () => clearTimeout(questionTimer);
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    if (!isFadeIn) {
      const fadeTimeout = setTimeout(() => {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setIsFadeIn(true);
      }, 500);

      return () => clearTimeout(fadeTimeout);
    }
  }, [isFadeIn]);

  return questions.length > 0 && currentQuestionIndex < questions.length ? (
    <div css={MainContainer}>
      <div key={currentQuestionIndex} css={viewContainerStyle(isFadeIn)}>
        <div css={{ position: 'relative', width: '100%' }}>
          <h1
            css={questionTitleStyle(isQuestionMovedUp)}
          >{`Q${currentQuestionIndex + 1}. ${questions[currentQuestionIndex].title}`}</h1>
          {showInput && (
            <div css={{ width: '100%', animation: `${fadeIn} 2s ease forwards` }}>
              <QuestionInput
                currentQuestionIndex={currentQuestionIndex}
                selectedKeywords={selectedKeywords}
                onSubmit={updateSelectedKeywords}
              />
              <div css={progressWrapperStyle}>
                <ClockIcon width="35px" height="35px" fill="#000" />
                <progress
                  id="progress"
                  value={initialTimeLeft > 0 ? (timeLeft / initialTimeLeft) * 100 : 100}
                  max={100}
                  css={progressBarStyle}
                />
              </div>
            </div>
          )}
          <div></div>
        </div>
        <KeywordsView
          questionId={questions[currentQuestionIndex].questionId}
          selectedKeywords={selectedKeywords}
          updateSelectedKeywords={updateSelectedKeywords}
        />
      </div>
    </div>
  ) : null;
};

export default QuestionsView;
