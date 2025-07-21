import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

interface Styles {
  alert: ViewStyle;
  alertTitle: TextStyle;
  alertMessage: TextStyle;
  alertMessageLeft: TextStyle;
  alertConfirm: ViewStyle;
  alertCancel: ViewStyle;
  alertButtonText: TextStyle;
}

export const styles = StyleSheet.create<Styles>({
  alert: {
    width: 300,
    height: 'auto',
    padding: 20,
    borderRadius: 10,
  },
  alertTitle: {
    ...fonts.smallTitle,
    color: colors.black,
    marginBottom: 5,
  },
  alertMessage: {
    ...fonts.mediumText,
    color: colors.darkGray,
    marginBottom: 10,
    lineHeight: 30,
    textAlign: 'center',
  },
  alertMessageLeft: {
    textAlign: 'left',
  },
  alertConfirm: {
    width: 'auto',
    height: 'auto',
    paddingVertical: 10,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  alertCancel: {
    width: 'auto',
    height: 'auto',
    paddingVertical: 10,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGreen,
  },
  alertButtonText: {
    ...fonts.mediumText,
  },
});
