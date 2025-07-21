import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

interface Styles {
  container: ViewStyle;
  dateText: TextStyle;
  emptyContainer: ViewStyle;
  emptyText: TextStyle;
}

export const styles = StyleSheet.create<Styles>({
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
