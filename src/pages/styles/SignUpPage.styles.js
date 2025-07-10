import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export const styles = StyleSheet.create({
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
