import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { styles } from './styles/Dot.styles';
import { colors } from '../../constants/colors';

// dot의 기본 너비와 활성화(선택) 상태일 때의 너비
const DOT_WIDTH = 10;
const DOT_ACTIVE_WIDTH = 16;

const Dot = ({ active }) => {
  // dot width를 위한 Animated.Value 배열
  const animatedWidth = useRef(new Animated.Value(active ? DOT_ACTIVE_WIDTH : DOT_WIDTH)).current;
  // dot 색상 변경을 위한 Animated.Value 배열
  const animatedActive = useRef(new Animated.Value(active ? 1 : 0)).current;
  // pageIndex가 바뀔 때 dot width 애니메이션
  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: active ? DOT_ACTIVE_WIDTH : DOT_WIDTH,
      duration: 200,
      useNativeDriver: false,
    }).start();
    Animated.timing(animatedActive, {
      toValue: active ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [active, animatedWidth, animatedActive]);

  const dotBackgroundColor = animatedActive.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.lightGreen, colors.primary],
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: animatedWidth,
          backgroundColor: dotBackgroundColor,
        },
      ]}
    />
  );
};

export default Dot;
