import { StyleSheet } from 'react-native';
import { fonts } from '../../constants/fonts';
import { colors } from '../../constants/colors';

export const styles = StyleSheet.create({
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
