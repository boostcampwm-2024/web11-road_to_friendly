import { create } from 'zustand';

interface Participant {
  id: string;
  nickname: string;
}

interface ParticipantsStore {
  participants: Participant[];
  hostId: string | null;
  setParticipants: (newParticipants: Participant[] | ((prev: Participant[]) => Participant[])) => void;
  setHostId: (newHostId: string) => void;
}

export const useParticipantsStore = create<ParticipantsStore>((set) => ({
  participants: [],
  hostId: null,
  setParticipants: (newParticipants) =>
    set((state) => ({
      participants: typeof newParticipants === 'function' ? newParticipants(state.participants) : newParticipants
    })),
  setHostId: (newHostId) => set({ hostId: newHostId })
}));
