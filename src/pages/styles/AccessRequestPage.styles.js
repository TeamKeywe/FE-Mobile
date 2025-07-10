import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '10%',
    paddingTop: '5%',
  },
  title: {
    ...fonts.mediumTitle,
    color: colors.black,
    marginTop: '5%',
    alignSelf: 'center',
    marginBottom: '5%',
  },
  itemText: {
    ...fonts.largeText,
    color: colors.black,
  },
  infoText: {
    ...fonts.largeText,
    textAlign: 'center',
    color: colors.darkGray,
    marginTop: '10%',
  },
});
