import { create } from 'zustand';

import { Question } from '@/types';

interface QuestionsStore {
  questions: Question[];
  setQuestions: (newQuestions: Question[] | ((prev: Question[]) => Question[])) => void;
}

export const useQuestionsStore = create<QuestionsStore>((set) => ({
  questions: [],
  setQuestions: (newQuestions) =>
    set((state) => ({
      questions: typeof newQuestions === 'function' ? newQuestions(state.questions) : newQuestions
    }))
}));
