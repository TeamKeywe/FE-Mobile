import { useState, useCallback } from 'react';
import { View, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getNoticeList, deleteAllNotice } from '../apis/NoticeListApi';
import { useAuthStore } from '../stores/authStore';
import { useNormalAlertStore } from '../stores/alertStore';
import { useNoticeBadgeStore } from '../stores/noticeStore';
import { styles } from './styles/NoticeListPage.styles';
import NoticeList from '../components/notices/NoticeList';
import GrayButton from '../components/buttons/GrayButton';

const titleTypeMap = {
  '보호자 신청 승인': 'APPROVE',
  '보호자 신청 거절': 'REJECT',
  '보호자 신청': 'APPLY',
};

const clearLastReadNoticeAt = useNoticeBadgeStore.getState().clearLastReadNoticeAt;

function convertToOldFormat(data) {
  return data.map((item, idx) => {
    const [date, time] = item.createdAt.split('T');
    return {
      id: idx + 1,
      type: titleTypeMap[item.title] || 'APPLY',
      date: date.replace(/-/g, '. '), // "2025. 05. 03"
      time: time.slice(0, 5), // "13:44"
      message: item.content,
    };
  });
}

export default function NoticeListPage() {
  const { setLoading } = useAuthStore();
  const showNormalAlert = useNormalAlertStore.getState().showNormalAlert;

  const [noticeList, setNoticeList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // 알림 전체 삭제
  const getNotices = async () => {
    setLoading(true);
    try {
      const data = await getNoticeList();
      setNoticeList(convertToOldFormat(data));
    } catch (error) {
      console.log('알림 목록 가져오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getNotices();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getNotices();
    setRefreshing(false);
  };

  // 알림 전체 삭제 핸들러
  const handleDeleteAllNotice = () => {
    showNormalAlert({
      title: '알림 전체 삭제 ',
      message: '알림 목록을 전체 삭제하시겠습니까?',
      onConfirmHandler: handleDeleteAllNoticeConfirm,
    });
  };

  const handleDeleteAllNoticeConfirm = async () => {
    try {
      await deleteAllNotice();
      setNoticeList([]);
      clearLastReadNoticeAt();
      showNormalAlert({
        title: '알림 삭제 완료',
        message: '',
        showCancel: false,
      });
    } catch (error) {
      showNormalAlert({
        title: '알림 삭제 실패',
        message: `알림 삭제 중\n오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.`,
        showCancel: false,
        confirmText: '확인',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.btnStyle}>
        <GrayButton
          title="알림 전체 삭제"
          onPressHandler={handleDeleteAllNotice}
          style={styles.text}
        />
      </View>
      <NoticeList
        data={noticeList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}
