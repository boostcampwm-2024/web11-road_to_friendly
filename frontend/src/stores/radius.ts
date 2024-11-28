import { create } from 'zustand';

import { MIN_SHORT_RADIUS, MIN_LONG_RADIUS, MAX_SHORT_RADIUS, MAX_LONG_RADIUS } from '@/constants';

interface RadiusStore {
  radius: [number, number];
  isOutOfBounds: boolean; // 화면 밖으로 벗어나는지 여부 플래그
  increaseRadius: () => void;
  increaseLongRadius: () => void;
  setOutOfBounds: (isOutOfBounds: boolean) => void;
}

export const useRadiusStore = create<RadiusStore>((set, get) => ({
  radius: [MIN_SHORT_RADIUS, MIN_LONG_RADIUS],
  isOutOfBounds: false,
  increaseRadius: () => set({ radius: [MAX_SHORT_RADIUS, MAX_LONG_RADIUS] }),
  increaseLongRadius: () => {
    const currentRadius = get().radius;
    set({ radius: [currentRadius[0], MAX_LONG_RADIUS + 100] });
  },
  setOutOfBounds: (isOutOfBounds: boolean) => {
    set(() => ({ isOutOfBounds: isOutOfBounds }));
  }
}));
