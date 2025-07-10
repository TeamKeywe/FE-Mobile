import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export const styles = StyleSheet.create({
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
