import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export const styles = StyleSheet.create({
  container: {
    marginTop: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: '5%',
    alignContent: 'center',
  },
  buttonDivider: {
    paddingVertical: 2,
    paddingTop: '5%',
    color: colors.darkGray,
    fontSize: 16,
  },
  title: {
    ...fonts.mediumTitle,
    marginBottom: '10%',
    color: colors.black,
  },
});
