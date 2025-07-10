import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  // 환자/보호자 버튼 아래 정보
  container: {
    marginBottom: '5%',
  },
  contentTitle: {
    ...fonts.smallTitle,
    color: colors.black,
    marginVertical: '5%',
  },
  inputWithButtonConatiner: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifyButton: {
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  verifyButtonText: {
    ...fonts.smallText,
    color: colors.white,
  },
});
