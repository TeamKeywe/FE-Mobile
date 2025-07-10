import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import acccessListIconGreen from '../assets/lotties/accessListIconGreen2.json';
import acccessListIconGray from '../assets/lotties/accessListIconGray2.json';
import homeIconGreen from '../assets/lotties/homeIconGreen2.json';
import homeIconGray from '../assets/lotties/homeIconGray2.json';
import noticeIconGreen from '../assets/lotties/noticeIconGreen.json';
import noticeIconGray from '../assets/lotties/noticeIconGray2.json';
import myPageIconGreen from '../assets/lotties/myPageGreen.json';
import myPageIconGray from '../assets/lotties/myPageGray.json';
import { useNoticeBadge } from '../hooks/useNoticeBadge';
import { styles } from './styles/AnimatedTabBar.styles';
import { colors } from '../constants/colors';

const TAB_ICONS = {
  MainPage: (isFocused) => (isFocused ? homeIconGreen : homeIconGray),
  AccessStack: (isFocused) => (isFocused ? acccessListIconGreen : acccessListIconGray),
  MyPageStack: (isFocused) => (isFocused ? myPageIconGreen : myPageIconGray),
  NoticeStack: (isFocused) => (isFocused ? noticeIconGreen : noticeIconGray),
};

const TAB_LABELS = {
  MainPage: '홈',
  AccessStack: '출입 권한',
  MyPageStack: '마이페이지',
  NoticeStack: '알림',
};

export default function AnimatedTabBar({ state, descriptors, navigation }) {
  const scales = useRef(state.routes.map(() => new Animated.Value(1))).current;
  const tilts = useRef(state.routes.map(() => new Animated.Value(0))).current;
  const lottieRefs = useRef(state.routes.map(() => React.createRef())).current;
  const { hasUnread } = useNoticeBadge();

  // 포커스 이동 시 Lottie 상태 제어
  useEffect(() => {
    state.routes.forEach((route, index) => {
      const isFocused = state.index === index;
      const lottieRef = lottieRefs[index]?.current;
      if (lottieRef) {
        if (isFocused) {
          lottieRef.play();
        } else {
          lottieRef.reset();
        }
      }
    });
  }, [state.index, state.routes, lottieRefs]);

  const onPress = (route, index, isFocused) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    // 포커스된 탭이 아니고, 이벤트가 취소되지 않았으면 해당 route로 이동
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
    Animated.parallel([
      // 크기 변화
      Animated.sequence([
        Animated.timing(scales[index], { toValue: 1.2, duration: 120, useNativeDriver: true }),
        Animated.spring(scales[index], { toValue: 1, friction: 3, useNativeDriver: true }),
      ]),
      // 기울기 변화
      Animated.sequence([
        Animated.timing(tilts[index], { toValue: 1, duration: 150, useNativeDriver: true }), // 느리게(150ms)
        Animated.timing(tilts[index], { toValue: -1, duration: 150, useNativeDriver: true }), // 느리게(150ms)
        Animated.timing(tilts[index], { toValue: 0, duration: 100, useNativeDriver: true }), // 중앙으로 복귀
      ]),
    ]).start();
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.white }}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          // 현재 탭이 포커스된 상태인지 확인
          const isFocused = state.index === index;
          // 현재 탭의 아이콘과 레이블 설정
          const iconName = TAB_ICONS[route.name](isFocused);
          const label = TAB_LABELS[route.name] || route.name;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={() => onPress(route, index, isFocused)}
              style={styles.tab}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.iconWrapper,
                  isFocused && styles.iconWrapperActive,
                  {
                    transform: [
                      { scale: scales[index] },
                      {
                        rotate: tilts[index].interpolate({
                          inputRange: [-1, 0, 1],
                          outputRange: ['-8deg', '0deg', '8deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <LottieView
                  ref={lottieRefs[index]}
                  source={iconName}
                  loop={false}
                  style={{ width: 32, height: 32 }}
                />
                {/* 알림 탭에만 뱃지 표시 */}
                {route.name === 'NoticeStack' && hasUnread && <View style={styles.noticeBadge} />}
              </Animated.View>
              <Text style={[styles.label, isFocused && styles.labelActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
