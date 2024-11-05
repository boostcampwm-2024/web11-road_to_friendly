import { create } from 'zustand';

interface Participant {
  id: string;
  nickname: string;
}

interface ParticipantsStore {
  participants: Participant[];
  setParticipants: (newParticipants: Participant[]) => void;
}

const useParticipantsStore = create<ParticipantsStore>((set) => ({
  participants: [],
  setParticipants: (newParticipants) =>
    set(() => ({
      participants: newParticipants
    }))
}));

export default useParticipantsStore;
