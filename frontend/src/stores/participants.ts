import { create } from 'zustand';

import { Participant } from '@/types';

interface ParticipantsStore {
  participants: { [id: string]: Participant };
  hostId: string | null;
  setParticipants: (
    newParticipants:
      | { [id: string]: Participant }
      | ((prev: { [id: string]: Participant }) => { [id: string]: Participant })
  ) => void;
  setHostId: (newHostId: string) => void;
}

export const useParticipantsStore = create<ParticipantsStore>((set) => ({
  participants: {
    eora21: {
      nickname: 'eora21',
      keywords: [
        { questionId: 4, keyword: '고양이', count: 5 },
        { questionId: 1, keyword: '짜장면', count: 3 },
        { questionId: 2, keyword: 'java', count: 2 },
        { questionId: 3, keyword: '심규선', count: 1 }
      ]
    },
    TaF: {
      nickname: 'TaF',
      keywords: [
        { questionId: 4, keyword: '고양이', count: 5 },
        { questionId: 2, keyword: 'java', count: 2 }
      ]
    }
  },
  hostId: null,
  setParticipants: (newParticipants) =>
    set((state) => ({
      participants: typeof newParticipants === 'function' ? newParticipants(state.participants) : newParticipants
    })),
  setHostId: (newHostId) => set({ hostId: newHostId })
}));
