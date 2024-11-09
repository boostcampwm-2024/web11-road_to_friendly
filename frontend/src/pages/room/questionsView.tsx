import { useEffect } from 'react';
import { Question } from '../../types';
import { useQuestionsStore, useSocketStore } from '../../stores/';

interface QuestionViewProps {
  onQuestionStart: () => void; // 질문이 표시될 때 인트로를 숨김
}

const QuestionsView = ({ onQuestionStart }: QuestionViewProps) => {
  const { socket } = useSocketStore();

  const { questions, setQuestions } = useQuestionsStore();

  useEffect(() => {
    if (socket) {
      socket.on('empathy:start', (questions: { questions: Question[] }) => {
        setQuestions((prev) => [...prev, ...questions.questions]);
        onQuestionStart();
      });
    }
  }, [socket, setQuestions]);

  return (
    <div>
      <h1>QuestionView</h1>
      {questions.map((question) => (
        <>
          <ul key={question.id}>
            <li>{question.title}</li>
            <li>{question.expirationTime}</li>
          </ul>
        </>
      ))}
    </div>
  );
};

// get
export default QuestionsView;
