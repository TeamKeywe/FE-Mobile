import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useNoticeBadgeStore = create(
  persist(
    (set) => ({
      lastReadNoticeAt: null, // 마지막으로 읽은 알림의 ISO 날짜
      setLastReadNoticeAt: (date) => set({ lastReadNoticeAt: date }),
      clearLastReadNoticeAt: () => set({ lastReadNoticeAt: null }),
      hasUnread: false, // 알림 안 읽음 여부
      setHasUnread: (value) => set({ hasUnread: value }),
    }),
    {
      name: 'notice-badge-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        lastReadNoticeAt: state.lastReadNoticeAt,
        hasUnread: state.hasUnread,
      }),
    },
  ),
);
