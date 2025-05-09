import { create } from 'zustand';

type ListStates = {
  delugeNextBaseUrl: string;
  delugeListRowSelection: {};
};

type ListActions = {
  setDelugeNextBaseUrl: (url: string) => void;
};

export const useDelugeListStore = create<ListStates & ListActions>((set) => ({
  delugeNextBaseUrl: '',
  delugeListRowSelection: {},

  setDelugeNextBaseUrl: (url: string) =>
    set(() => ({ delugeNextBaseUrl: url })),

  setDelugeListRowSelection: (selection: {}) =>
    set(() => ({ delugeListRowSelection: selection })),
}));
