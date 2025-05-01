import { create } from 'zustand';

type States = {
  count: number;
  delugeNextBaseUrl: string;
};

type Actions = {
  increase: () => void;
  decrease: () => void;
  setDelugeNextBaseUrl: (url: string) => void;
};

export const useCountStore = create<States & Actions>((set) => ({
  count: 0,
  delugeNextBaseUrl: '',

  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
  setDelugeNextBaseUrl: (url: string) =>
    set(() => ({ delugeNextBaseUrl: url })),
}));
