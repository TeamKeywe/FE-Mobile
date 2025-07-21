import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  text: TextStyle;
  textInput: ViewStyle;
  button: ViewStyle;
}

export const styles = StyleSheet.create<Styles>({
  container: {
    marginTop: '10%',
    alignItems: 'center',
  },
  title: {
    ...fonts.mediumTitle,
    marginBottom: '5%',
    color: colors.black,
  },
  text: {
    ...fonts.mediumText,
    marginBottom: '10%',
    color: colors.darkGray,
  },
  textInput: { marginBottom: '10%' },
  button: { marginTop: '5%' },
});
