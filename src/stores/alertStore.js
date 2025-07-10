import { create } from 'zustand';

export const useNormalAlertStore = create((set) => ({
  show: false,
  title: '',
  message: '',
  showCancel: true,
  confirmText: '확인',
  cancelText: '취소',
  onConfirmHandler: null,
  onCancelHandler: null,
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
      onConfirmHandler: null,
      onCancelHandler: null,
    }),
}));
