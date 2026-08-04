import { create } from 'zustand';

import { DEMO_USER_EMAIL } from '@/lib/constants';

interface AppState {
  demoUserEmail: string;
  setDemoUserEmail: (email: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  demoUserEmail: DEMO_USER_EMAIL,
  setDemoUserEmail: (email) => set({ demoUserEmail: email }),
}));
