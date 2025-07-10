import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import { navigationRef, isReadyRef } from './src/navigations/NavigationRef';
import { useNormalAlertStore } from './src/stores/alertStore';
import { useNoticeBadge } from './src/hooks/useNoticeBadge';
import AppNavigator from './src/navigations/AppNavigator';
import NormalAlert from './src/components/alerts/NormalAlert';

function moveToNotice() {
  if (isReadyRef.current) {
    navigationRef.current?.navigate('NoticeStack');
  } else {
    // 네비게이터가 준비될 때까지 폴링
    const interval = setInterval(() => {
      if (isReadyRef.current) {
        navigationRef.current?.navigate('NoticeStack');
        clearInterval(interval);
      }
    }, 100);
  }
}

const App = () => {
  // zustand의 상태와 show 함수 한 번에 가져오기
  const alertProps = useNormalAlertStore();
  const showNormalAlert = useNormalAlertStore.getState().showNormalAlert;
  const { checkNotice, markAllAsRead } = useNoticeBadge();

  useEffect(() => {
    // 앱 첫 실행 시, 알림 권한 요청
    const requestPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          showNormalAlert({
            title: '알림 권한 필요',
            message: '설정에서 알림 권한을 허용해 주세요.',
            showCancel: false,
            confirmText: '닫기',
          });
        }
      }
    };
    requestPermission();

    // FCM 리스너
    const messagingInstance = getMessaging(getApp());

    // 포그라운드 알림
    const unsubscribe = onMessage(messagingInstance, async (remoteMessage) => {
      showNormalAlert({
        title: remoteMessage.notification?.title || '알림',
        message: remoteMessage.notification?.body || '메시지 도착',
        confirmText: '이동',
        onConfirmHandler: async () => {
          await markAllAsRead();
          moveToNotice();
        },
        onCancelHandler: async () => {
          await checkNotice();
        },
      });
      // checkNotice 호출 전후로 로그
      await checkNotice();
    });

    // 백그라운드/종료 상태에서 알림 클릭
    const unsubscribeOpened = onNotificationOpenedApp(messagingInstance, (remoteMessage) => {
      moveToNotice();
    });

    // 앱 완전 종료 후 알림 클릭
    getInitialNotification(messagingInstance).then((remoteMessage) => {
      if (remoteMessage) moveToNotice();
    });

    return () => {
      unsubscribe();
      unsubscribeOpened();
    };
  }, [showNormalAlert, checkNotice]);

  return (
    <SafeAreaProvider>
      <NormalAlert {...alertProps} />
      <AppNavigator />
    </SafeAreaProvider>
  );
};

export default App;
