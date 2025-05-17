import { create } from 'zustand';

type ListStates = {
  delugeNextBaseUrl: string;
};

type ListActions = {
  setDelugeNextBaseUrl: (url: string) => void;
};

export const useDelugeListStore = create<ListStates & ListActions>((set) => ({
  delugeNextBaseUrl: '',

  setDelugeNextBaseUrl: (url: string) =>
    set(() => ({ delugeNextBaseUrl: url })),
}));
