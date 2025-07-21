import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MemberInfo } from '../apis/MyPageApi';

export interface UserInfo extends MemberInfo {}

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  setOnlyAccessToken: (token: string | null) => void;
  clearAccessToken: () => void;

  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;

  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo | null) => void;

  loading: boolean;
  setLoading: (value: boolean) => void;

  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  lastAuthTime: number;
  setLastAuthTime: (time: number) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // 토큰 상태 관리
      accessToken: null,
      setAccessToken: (token: string | null) =>
        set({
          accessToken: token,
          isLoggedIn: !!token,
        }),
      //토큰 값만 설정할 때 사용
      setOnlyAccessToken: (token: string | null) =>
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
      setIsLoggedIn: (value: boolean) => set({ isLoggedIn: value }),

      // 사용자 정보 관리
      userInfo: null,
      setUserInfo: (userInfo: UserInfo | null) => set({ userInfo }),

      // 로딩 상태 관리
      loading: false,
      setLoading: (value: boolean) => set({ loading: value }),

      // hydration(스토리지 복원) 상태
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),

      //인증 시각 관리
      lastAuthTime: 0,
      setLastAuthTime: (time: number) => set({ lastAuthTime: time }),
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
