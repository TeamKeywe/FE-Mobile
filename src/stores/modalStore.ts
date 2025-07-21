import { create } from 'zustand';

interface ModalStore {
  isPasswordModalVisible: boolean;
  pendingTab: string | null;
  prevTab: string;
  isFromAppState: boolean;
  showPasswordModal: (tabName: string, prevTab: string, isFromAppState?: boolean) => void;
  hidePasswordModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isPasswordModalVisible: false,
  pendingTab: null, // 이동 시도한 탭 이름
  prevTab: '', // 이전 탭 이름
  isFromAppState: false, // 모달 출현 이유
  showPasswordModal: (tabName: string, prevTab: string, isFromAppState: boolean = false) =>
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
