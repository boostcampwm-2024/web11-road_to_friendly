import { css, keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';

import ClockIcon from '@/assets/icons/clock.svg?react';
import { useQuestionsStore, useSocketStore } from '@/stores/';
import { flexStyle, Variables, fadeIn, fadeOut } from '@/styles';
import { Question } from '@/types';
import { getRemainingSeconds } from '@/utils';
import KeywordsView from './KeywordsView';
import { MAX_LONG_RADIUS } from '@/constants';
import { QuestionInput } from '@/components';
import LoadingPage from '../LoadingPage';

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
}

const QuestionsView = ({ onQuestionStart }: QuestionViewProps) => {
  const { socket } = useSocketStore();
  const { questions, setQuestions } = useQuestionsStore();
  const [loading, setLoading] = useState<boolean>(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTimeLeft, setInitialTimeLeft] = useState(0);
  const [isFadeIn, setIsFadeIn] = useState(true);
  const [isQuestionMovedUp, setIsQuestionMovedUp] = useState(false);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on('empathy:start', (response: { questions: Question[] }) => {
        setQuestions(response.questions);
        onQuestionStart();
        if (response.questions.length > 0) {
          const firstQuestionTimeLeft = getRemainingSeconds(new Date(response.questions[0].expirationTime), new Date());
          setTimeLeft(300);
          setInitialTimeLeft(300);
        }
      });
    }
  }, [socket, setQuestions, onQuestionStart]);

  useEffect(() => {
    if (currentQuestionIndex >= questions.length) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime < 1) {
          setIsFadeIn(false);
          setIsQuestionMovedUp(false);
          setShowInput(false);

          //마지막 질문이 끝난 경우의 처리
          if (currentQuestionIndex === questions.length - 1) {
            //전환 페이지 표시
            setLoading(true);

            //서버에게 종료 알림 전송
            if (socket) {
              socket.emit('empathy:end');
            }
          }
          return prevTime;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
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
        if (questions[currentQuestionIndex + 1]) {
          const nextTimeLeft = getRemainingSeconds(
            new Date(questions[currentQuestionIndex + 1].expirationTime),
            new Date()
          );
          setInitialTimeLeft(nextTimeLeft);
          setTimeLeft(nextTimeLeft);
        }
        setIsFadeIn(true);
      }, 500);

      return () => clearTimeout(fadeTimeout);
    }
  }, [isFadeIn]);

  return loading ? (
    <LoadingPage isAnalyzing={true} />
  ) : questions.length > 0 && currentQuestionIndex < questions.length ? (
    <div css={MainContainer}>
      <div key={currentQuestionIndex} css={viewContainerStyle(isFadeIn)}>
        <div css={{ position: 'relative', width: '100%' }}>
          <h1
            css={questionTitleStyle(isQuestionMovedUp)}
          >{`Q${currentQuestionIndex + 1}. ${questions[currentQuestionIndex].title}`}</h1>
          {showInput && (
            <div css={{ width: '100%', animation: `${fadeIn} 2s ease forwards` }}>
              <QuestionInput currentQuestionIndex={currentQuestionIndex} />
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
        <KeywordsView questionId={questions[currentQuestionIndex].questionId} />
      </div>
    </div>
  ) : null;
};

export default QuestionsView;
