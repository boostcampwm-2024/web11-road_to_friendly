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
  participants: {},
  hostId: null,
  setParticipants: (newParticipants) =>
    set((state) => ({
      participants: typeof newParticipants === 'function' ? newParticipants(state.participants) : newParticipants
    })),
  setHostId: (newHostId) => set({ hostId: newHostId })
}));
