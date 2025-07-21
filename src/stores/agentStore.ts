import { create } from 'zustand';

interface AgentStore {
  agent: any; 
  setAgent: (agent: any) => void;
  clearAgent: () => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agent: null,
  setAgent: (agent: any) => set({ agent }),
  clearAgent: () => set({ agent: null }),
}));
