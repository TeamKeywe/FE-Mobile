import { create } from 'zustand';

export const useModalStore = create((set) => ({
  isPasswordModalVisible: false,
  pendingTab: null, // 이동 시도한 탭 이름
  prevTab: '', // 이전 탭 이름
  isFromAppState: false, // 모달 출현 이유
  showPasswordModal: (tabName, prevTab, isFromAppState = false) =>
    set({
      isPasswordModalVisible: true,
      pendingTab: tabName,
      prevTab,
      isFromAppState,
    }),
  hidePasswordModal: () =>
    set({
      isPasswordModalVisible: false,
      pendingTab: null,
      isFromAppState: false, // 닫을 때 초기화
    }),
}));
