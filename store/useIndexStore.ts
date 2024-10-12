import { create } from 'zustand';
import { IndexData } from '@/types/index';

interface IndexStore {
  indexData: IndexData | null;
  setIndexData: (data: IndexData | null) => void;
}

export const useIndexStore = create<IndexStore>((set) => ({
  indexData: null,
  setIndexData: (data) => set({ indexData: data }),
}));