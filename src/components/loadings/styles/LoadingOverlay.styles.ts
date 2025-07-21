import { StyleSheet, ViewStyle } from 'react-native';

interface Styles {
  overlay: ViewStyle;
}

export const styles = StyleSheet.create<Styles>({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)', // 반투명 검정
    justifyContent: 'center',
    alignItems: 'center',
  },
});
