import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Hospital {
  hospitalId: number;
  hospitalName: string;
}

interface HospitalStore {
  hospitalList: Hospital[];
  setHospitalList: (list: Hospital[]) => void;
  getHospitalNameById: (id: number) => string;
  clearHospitalList: () => void;
}

export const useHospitalStore = create<HospitalStore>()(
  persist(
    (set, get) => ({
      hospitalList: [],
      setHospitalList: (list: Hospital[]) => set({ hospitalList: list }),
      getHospitalNameById: (id: number): string => {
        const found = get().hospitalList.find((h) => h.hospitalId === id);
        return found ? found.hospitalName : '';
      },
      clearHospitalList: () => set({ hospitalList: [] }),
    }),
    {
      name: 'hospital-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ hospitalList: state.hospitalList }),
    },
  ),
);
