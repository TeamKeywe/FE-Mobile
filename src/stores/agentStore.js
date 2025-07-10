import { create } from 'zustand';

export const useAgentStore = create((set) => ({
  agent: null,
  setAgent: (agent) => set({ agent }),
  clearAgent: () => set({ agent: null }),
}));
