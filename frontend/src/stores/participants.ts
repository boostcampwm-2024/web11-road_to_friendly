import { create } from 'zustand';

interface Participant {
  id: string;
  nickname: string;
}

interface ParticipantsStore {
  participants: Participant[];
  setParticipants: (newParticipants: Participant[] | ((prev: Participant[]) => Participant[])) => void;
}

const useParticipantsStore = create<ParticipantsStore>((set) => ({
  participants: [],
  setParticipants: (newParticipants) =>
    set((state) => ({
      participants: typeof newParticipants === 'function' ? newParticipants(state.participants): newParticipants
    }))
}));

export default useParticipantsStore;
