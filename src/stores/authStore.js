import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // 토큰 상태 관리
      accessToken: null,
      setAccessToken: (token) =>
        set({
          accessToken: token,
          isLoggedIn: !!token,
        }),
      //토큰 값만 설정할 때 사용
      setOnlyAccessToken: (token) =>
        set({
          accessToken: token,
        }),
      clearAccessToken: () =>
        set({
          accessToken: null,
          isLoggedIn: false,
          userInfo: null,
        }),

      // 로그인 상태 관리
      isLoggedIn: false,
      setIsLoggedIn: (value) => set({ isLoggedIn: value }),

      // 사용자 정보 관리
      userInfo: null,
      setUserInfo: (userInfo) => set({ userInfo }),

      // 로딩 상태 관리
      loading: false,
      setLoading: (value) => set({ loading: value }),

      // hydration(스토리지 복원) 상태
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      //인증 시각 관리
      lastAuthTime: 0,
      setLastAuthTime: (time) => set({ lastAuthTime: time }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        isLoggedIn: state.isLoggedIn,
        userInfo: state.userInfo,
        lastAuthTime: state.lastAuthTime,
      }),
      // 복원 완료 시 _hasHydrated를 true로 변경
      onRehydrateStorage: () => (state, error) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
