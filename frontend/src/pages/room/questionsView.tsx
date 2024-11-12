import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

import ClockIcon from '@/assets/icons/clock.svg?react';
import { QuestionInput } from '@/components';
import { useQuestionsStore, useSocketStore } from '@/stores/';
import { flexStyle, Variables, fadeIn, fadeOut } from '@/styles';
import { Question } from '@/types';
import { getRemainingSeconds } from '@/utils';

const viewContainerStyle = (isFadeIn: boolean) => css`
  animation: ${isFadeIn ? fadeIn : fadeOut} 0.5s ease;
  opacity: ${isFadeIn ? 1 : 0};
`;

const questionTitleStyle = css({
  font: Variables.typography.font_bold_32,
  marginBottom: Variables.spacing.spacing_sm
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
  onQuestionStart: () => void; // 질문이 표시될 때 인트로를 숨김
}

const QuestionsView = ({ onQuestionStart }: QuestionViewProps) => {
  const { socket } = useSocketStore();
  const { questions, setQuestions } = useQuestionsStore();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTimeLeft, setInitialTimeLeft] = useState(0); // 각 질문의 초기 시간
  const [isFadeIn, setIsFadeIn] = useState(true);

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
    }
  }, [socket, setQuestions, onQuestionStart]);

  useEffect(() => {
    if (currentQuestionIndex >= questions.length) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime < 1) {
          setIsFadeIn(false);
          return prevTime;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
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
        setIsFadeIn(true); // 다음 질문을 위해 페이드인 상태로 전환
      }, 500); // 페이드아웃 효과 시간과 일치

      return () => clearTimeout(fadeTimeout);
    }
  }, [isFadeIn]);

  return questions.length > 0 && currentQuestionIndex < questions.length ? (
    <div key={currentQuestionIndex} css={viewContainerStyle(isFadeIn)}>
      <h1 css={questionTitleStyle}>{`Q${currentQuestionIndex + 1}. ${questions[currentQuestionIndex].title}`}</h1>
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
  ) : null;
};

export default QuestionsView;
