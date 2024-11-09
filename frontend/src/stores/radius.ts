import { create } from 'zustand';
import { MIN_RADIUS, MAX_RADIUS } from '../constants';

interface RadiusStore {
  radius: number;
  increaseRadius: () => void;
}

export const useRadiusStore = create<RadiusStore>((set) => ({
  radius: MIN_RADIUS,
  increaseRadius: () => set({ radius: MAX_RADIUS })
}));
