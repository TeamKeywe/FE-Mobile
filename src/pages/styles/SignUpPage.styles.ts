import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

interface Styles {
  title: TextStyle;
  scrollView: ViewStyle;
  textInput: ViewStyle;
  button: ViewStyle;
  gongback: ViewStyle;
}

export const styles = StyleSheet.create<Styles>({
  title: {
    ...fonts.mediumTitle,
    color: colors.black,
    textAlign: 'center',
    marginBottom: '7%',
  },
  scrollView: { alignItems: 'center' },
  textInput: { alignItems: 'center' },
  button: { marginTop: '7%' },
  gongback: { marginBottom: '30%' },
});
