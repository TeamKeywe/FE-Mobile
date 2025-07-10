import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useHospitalStore = create(
  persist(
    (set, get) => ({
      hospitalList: [],
      setHospitalList: (list) => set({ hospitalList: list }),
      getHospitalNameById: (id) => {
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
