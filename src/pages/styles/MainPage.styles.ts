import { StyleSheet, ViewStyle, ImageStyle } from 'react-native';

interface Styles {
  container: ViewStyle;
  logoImage: ImageStyle;
}

export const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    paddingTop: '5%',
  },
  logoImage: {
    width: 180,
    height: 60,
    marginTop: '3%',
    alignSelf: 'center',
  },
});
