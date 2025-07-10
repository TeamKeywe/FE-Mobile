import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: {
    paddingBottom: 90,
    paddingHorizontal: 10,
  },
  dateText: {
    ...fonts.mediumText,
    color: colors.white,
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...fonts.largeText,
    marginTop: -50,
    color: colors.moreLightGray,
  },
});
