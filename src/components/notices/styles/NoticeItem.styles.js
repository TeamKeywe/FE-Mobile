import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginEnd: 5,
  },
  text: {
    ...fonts.smallText,
    color: colors.black,
  },
});
