import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  button: {
    paddingVertical: 2,
    paddingTop: '5%',
    alignItems: 'flex-end',
    marginHorizontal: '5%',
  },
  text: {
    ...fonts.smallText,
    color: colors.darkGray,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGray,
    alignSelf: 'center',
  },
});
