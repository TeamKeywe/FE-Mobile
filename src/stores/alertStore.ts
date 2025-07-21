import { create } from 'zustand';

interface NormalAlertOptions {
  title?: string;
  message?: string;
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirmHandler?: () => void;
  onCancelHandler?: () => void;
  left?: boolean;
}

interface NormalAlertStore {
  show: boolean;
  title: string;
  message: string;
  showCancel: boolean;
  confirmText: string;
  cancelText: string;
  onConfirmHandler: () => void;
  onCancelHandler: () => void;
  left: boolean;
  showNormalAlert: (options: NormalAlertOptions) => void;
  hideNormalAlert: () => void;
}

export const useNormalAlertStore = create<NormalAlertStore>((set) => ({
  show: false,
  title: '',
  message: '',
  showCancel: true,
  confirmText: '확인',
  cancelText: '취소',
  onConfirmHandler: () => {},
  onCancelHandler: () => {},
  left: false,

  // Alert 표시
  showNormalAlert: ({
    title = '',
    message = '',
    showCancel = true,
    confirmText = '확인',
    cancelText = '취소',
    onConfirmHandler,
    onCancelHandler,
    left,
  }) =>
    set({
      show: true,
      title,
      message,
      showCancel,
      confirmText,
      cancelText,
      onConfirmHandler: onConfirmHandler
        ? () => {
            onConfirmHandler();
            set({ show: false });
          }
        : () => set({ show: false }),
      onCancelHandler: onCancelHandler
        ? () => {
            onCancelHandler();
            set({ show: false });
          }
        : () => set({ show: false }),
      left,
    }),

  // Alert 숨기기
  hideNormalAlert: () =>
    set({
      show: false,
      title: '',
      message: '',
      showCancel: false,
      onConfirmHandler: () => {},
      onCancelHandler: () => {},
    }),
}));
