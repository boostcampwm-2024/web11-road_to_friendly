import { useEffect } from 'react';
import { useSocket } from '../../hooks';
import useQuestionsStore from '../../stores/questions';

interface QuestionViewProps {
  onQuestionStart: () => void; // 질문이 표시될 때 인트로를 숨김
}

const QuestionsView = ({ onQuestionStart }: QuestionViewProps) => {
  const socket = useSocket();
  const { questions, setQuestions } = useQuestionsStore();

  useEffect(() => {
    if (socket) {
      // socket.on('empathy:start', (questions: { questions: Question[] }) => {
      //   setQuestions((prev) => [
      //     ...prev,
      //     {
      //       id: '1',
      //       title: '좋아하는 취미는?',
      //       expirationTime: (Date.now() + 1000 * 30).toString()
      //     },
      //     {
      //       id: '2',
      //       title: '좋아하는 음식은?',
      //       expirationTime: (Date.now() + 1000 * 30).toString()
      //     }
      //   ]);
      // });

      setQuestions((prev) => [
        ...prev,
        {
          id: '1',
          title: '좋아하는 취미는?',
          expirationTime: (Date.now() + 1000 * 30).toString()
        },
        {
          id: '2',
          title: '좋아하는 음식은?',
          expirationTime: (Date.now() + 1000 * 60).toString()
        }
      ]);

      // onQuestionStart();
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
