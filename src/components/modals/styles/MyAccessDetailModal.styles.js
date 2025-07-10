import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  modalContainer: {
    width: 300,
    maxHeight: '80%',
    padding: '5%',
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  modalTitle: {
    ...fonts.mediumTitle,
    color: colors.black,
    marginTop: '10%',
    alignSelf: 'center',
  },
  modalContentTitle: {
    ...fonts.mediumText,
    color: colors.black,
    marginVertical: '5%',
    alignSelf: 'center',
  },
  textContainer: {
    marginTop: '7%',
    marginBottom: '5%',
    marginTop: '5%',
  },
  modalText: {
    ...fonts.smallText,
    color: colors.darkGray,
    marginTop: 2,
    lineHeight: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'stretch',
    marginBottom: '7%',
  },
  button: {
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '5%',
    paddingHorizontal: '10%',
    borderRadius: 8,
    marginHorizontal: '3%',
  },
  QRButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.lightGreen,
  },
  buttonText: {
    ...fonts.mediumText,
    color: colors.white,
  },
});
