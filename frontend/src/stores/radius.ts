import { create } from 'zustand';

import { MIN_SHORT_RADIUS, MIN_LONG_RADIUS, MAX_SHORT_RADIUS, MAX_LONG_RADIUS } from '@/constants';

interface RadiusStore {
  radius: [number, number];
  increaseRadius: () => void;
  increaseLongRadius: () => void;
}

export const useRadiusStore = create<RadiusStore>((set, get) => ({
  radius: [MIN_SHORT_RADIUS, MIN_LONG_RADIUS],
  increaseRadius: () => set({ radius: [MAX_SHORT_RADIUS, MAX_LONG_RADIUS] }),
  increaseLongRadius: () => {
    const currentRadius = get().radius;
    set({ radius: [currentRadius[0], MAX_LONG_RADIUS + 100] });
  }
}));
