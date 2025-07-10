import { useState, useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, AppState } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getMyInfo } from '../apis/MyPageApi';
import { useAuthStore } from '../stores/authStore';
import { useModalStore } from '../stores/modalStore';
import { colors } from '../constants/colors';
import { navigationRef, isReadyRef } from './NavigationRef';
import { useNoticeBadge } from '../hooks/useNoticeBadge';
import LoadingOverlay from '../components/loadings/LoadingOverlay';
import PasswordConfirmModal from '../components/modals/PasswordConfirmModal';
import AnimatedTabBar from './AnimatedTabBar';
import WelcomePage from '../pages/WelcomePage';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import SignUpVerificationPage from '../pages/SignUpVerificationPage';
import MainPage from '../pages/MainPage';
import MyPage from '../pages/MyPage';
import NoticeListPage from '../pages/NoticeListPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import AccessListPage from '../pages/AccessListPage';
import MyAccessListPage from '../pages/MyAccessListPage';
import AccessRequestPage from '../pages/AccessRequestPage';
import AccessRequestRolePage from '../pages/AccessRequestRolePage';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const PASSWORD_AUTH_VALID_MS = 5 * 60 * 1000; // 비밀번호 재인증 시간 (5분)

// StatusBar 스타일 설정
const WHITE_TAB_SCREENS = ['MainPage', 'WelcomePage'];

// Stack 네비게이터 옵션
const screenOptions = {
  headerStyle: { backgroundColor: colors.secondary, height: 100 },
  headerTintColor: colors.white,
  headerTitleStyle: { fontWeight: '600', fontSize: 26 },
  headerTitleAlign: 'center',
  gestureEnabled: true,
  headerBackImage: () => <Ionicons name="chevron-back" size={24} color={colors.white} />,
  headerBackTitle: '',
};

// 스택 네비게이터
// 마이페이지 스택 네비게이터
function MyPageStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="MyPage" component={MyPage} options={{ headerShown: false }} />
      <Stack.Screen
        name="ChangePasswordPage"
        component={ChangePasswordPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// 출입 권한 스택 네비게이터
function AccessStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="AccessListPage"
        component={AccessListPage}
        options={{ title: '출입 권한' }}
      />
      <Stack.Screen
        name="MyAccessListPage"
        component={MyAccessListPage}
        options={{ title: '권한 목록 조회' }}
      />
      <Stack.Screen
        name="AccessRequestPage"
        component={AccessRequestPage}
        options={{ title: '출입 권한 신청' }}
      />
      <Stack.Screen
        name="AccessRequestRolePage"
        component={AccessRequestRolePage}
        options={{ title: '출입 권한 신청' }}
      />
    </Stack.Navigator>
  );
}

// 알림 스택 네비게이터
function NoticeStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="NoticeListPage" component={NoticeListPage} options={{ title: '알림' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const {
    isLoggedIn,
    setIsLoggedIn,
    accessToken,
    setLoading,
    loading,
    setAccessToken,
    clearAccessToken,
    _hasHydrated, // hydration flag
  } = useAuthStore();
  const lastAuthTime = useAuthStore((state) => state.lastAuthTime);
  const appState = useRef(AppState.currentState);

  const showPasswordModal = useModalStore((state) => state.showPasswordModal);

  // 현재 라우트 이름을 저장하는 state
  const [currentRouteName, setCurrentRouteName] = useState(isLoggedIn ? 'MainPage' : 'WelcomePage');

  // 알림 읽음 여부 관련
  const { hasUnread, markAllAsRead } = useNoticeBadge();

  // useEffect: 앱 시작 시 토큰 유효성 확인
  useEffect(() => {
    if (!_hasHydrated) return;
    const checkToken = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (accessToken) {
          try {
            await getMyInfo();
            setAccessToken(accessToken); // 토큰 유효
          } catch (error) {
            clearAccessToken();
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, [_hasHydrated]);

  // 탭 클릭 시 비밀번호 모달 호출
  const handleTabPress = (e, tabName) => {
    if (!lastAuthTime || Date.now() - lastAuthTime > PASSWORD_AUTH_VALID_MS) {
      e.preventDefault();
      showPasswordModal(tabName, currentRouteName || 'MainPage');
    }
  };

  // 비밀번호 모달 백그라운드 -> 포그라운드 변경시 적용
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      // 포그라운드로 돌아올 때
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // 현재 라우트가 마이페이지(혹은 마이페이지 stack 내부)라면
        if (currentRouteName === 'MyPage' || currentRouteName === 'MyPageStack') {
          // 인증 만료됐으면 모달 띄우기
          if (!lastAuthTime || Date.now() - lastAuthTime > PASSWORD_AUTH_VALID_MS) {
            showPasswordModal('MyPageStack', currentRouteName, true);
          }
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [currentRouteName, lastAuthTime]);

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.white,
    },
  };

  // hydration이 끝날 때까지 아무것도 렌더하지 않음(혹은 Splash)
  if (!_hasHydrated) {
    return null;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
      onStateChange={() => {
        const route = navigationRef.current?.getCurrentRoute();
        setCurrentRouteName(route?.name);
      }}
      theme={navTheme}
    >
      <LoadingOverlay visible={loading} />
      <StatusBar
        backgroundColor={
          WHITE_TAB_SCREENS.includes(currentRouteName) ? colors.white : colors.secondary
        }
        barStyle={WHITE_TAB_SCREENS.includes(currentRouteName) ? 'dark-content' : 'light-content'}
      />
      <PasswordConfirmModal navigationRef={navigationRef} />
      {isLoggedIn ? (
        <Tab.Navigator
          screenOptions={{ headerShown: false }}
          tabBar={(props) => <AnimatedTabBar {...props} />}
        >
          <Tab.Screen name="MainPage" component={MainPage} options={{ title: '홈' }} />
          <Tab.Screen name="AccessStack" component={AccessStack} options={{ title: '출입 권한' }} />
          <Tab.Screen
            name="NoticeStack"
            component={NoticeStack}
            options={{
              title: '알림',
            }}
            listeners={{
              tabPress: () => {
                markAllAsRead(); // 알림탭 진입 시 읽음 처리
              },
            }}
          />
          <Tab.Screen
            name="MyPageStack"
            component={MyPageStack}
            options={{ title: '마이페이지' }}
            // 비밀번호 인증 모달
            listeners={{
              tabPress: (error) => handleTabPress(error, 'MyPageStack'), // 비밀번호 인증 이후 이동
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen
            name="WelcomePage"
            component={WelcomePage}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
          <Stack.Screen name="SignUpPage" component={SignUpPage} options={{ headerShown: false }} />
          <Stack.Screen
            name="SignUpVerificationPage"
            component={SignUpVerificationPage}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
