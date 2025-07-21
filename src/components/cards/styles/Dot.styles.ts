import { StyleSheet, ViewStyle } from 'react-native';

interface Styles {
  dot: ViewStyle;
}

export const styles = StyleSheet.create<Styles>({
  dot: {
    height: 10,
    borderRadius: 16,
    marginHorizontal: 4,
  },
});
