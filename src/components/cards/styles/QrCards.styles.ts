import { StyleSheet, ViewStyle } from 'react-native';

interface Styles {
  dotContainer: ViewStyle;
}

export const styles = StyleSheet.create<Styles>({
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: '10%',
    marginTop: '-5%',
  },
});
