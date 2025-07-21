import { StyleSheet, ViewStyle, ImageStyle } from 'react-native';

interface Styles {
  contentContainer: ViewStyle;
  animationImage: ImageStyle;
}

export const styles = StyleSheet.create<Styles>({
  // 전체 컨테이너
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 애니메이션 이미지
  animationImage: {
    width: 60,
    height: 60,
  },
});
