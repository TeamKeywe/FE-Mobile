import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { fonts } from '../../constants/fonts';
import { colors } from '../../constants/colors';

interface Styles {
  container: ViewStyle;
  btnStyle: ViewStyle;
  text: TextStyle;
}

export const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  btnStyle: { alignSelf: 'flex-end' },
  text: {
    ...fonts.smallText,
    color: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
    alignSelf: 'center',
  },
});
