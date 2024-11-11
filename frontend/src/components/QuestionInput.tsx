import { useToast } from '@/hooks';
import { useSocketStore } from '@/stores';
import { useState } from 'react';

interface QuestionInputProps {
  currentQuestionIndex: number;
}

const QuestionInput = ({ currentQuestionIndex }: QuestionInputProps) => {
  const [keyword, setKeyword] = useState('');
  const { openToast } = useToast();
  const { socket } = useSocketStore();

  function handleEnter(e: React.KeyboardEvent) {
    if (e.code !== 'Enter') return;

    if (keyword.length === 0) {
      openToast({ type: 'error', text: '답변이 비어있어요! 입력 후 Enter를 눌러주세요.' });
      return;
    }

    if (socket && socket.connected) {
      socket?.emit('empathy:keyword:pick', { questionId: currentQuestionIndex, keyword });
    } else {
      openToast({ text: '연결 상태가 원활하지 않은 것 같아요. Enter를 눌러 다시 전송해주세요.', type: 'error' });
    }
  }

  return (
    <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => handleEnter(e)} />
  );
};

export default QuestionInput;
