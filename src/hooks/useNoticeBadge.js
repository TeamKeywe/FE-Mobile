import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useNoticeBadgeStore } from '../stores/noticeStore';
import { getMostRecentNotice } from '../apis/NoticeListApi';

export function useNoticeBadge() {
  const lastReadNoticeAt = useNoticeBadgeStore((s) => s.lastReadNoticeAt);
  const setLastReadNoticeAt = useNoticeBadgeStore((s) => s.setLastReadNoticeAt);
  const hasUnread = useNoticeBadgeStore((s) => s.hasUnread);
  const setHasUnread = useNoticeBadgeStore((s) => s.setHasUnread);

  // 최신 알림과 lastReadNoticeAt 비교 함수
  const checkNotice = async () => {
    try {
      const recent = await getMostRecentNotice();
      if (!recent?.createdAt) {
        setHasUnread(false);
        return;
      }
      if (!lastReadNoticeAt || recent.createdAt !== lastReadNoticeAt) {
        setHasUnread(true);
      } else {
        setHasUnread(false);
      }
    } catch (error) {
      setHasUnread(false);
    }
  };

  // 앱 활성화(AppState) 시 체크
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        checkNotice();
      }
    };
    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, [lastReadNoticeAt]);

  // lastReadNoticeAt이 바뀔 때도 체크 (탭 진입 등)
  useEffect(() => {
    checkNotice();
  }, [lastReadNoticeAt]);

  // 알림탭 진입 시: 최신 알림을 읽음 처리
  const markAllAsRead = async () => {
    const recent = await getMostRecentNotice();
    if (recent?.createdAt) setLastReadNoticeAt(recent.createdAt);
  };

  return { hasUnread, markAllAsRead, checkNotice };
}
