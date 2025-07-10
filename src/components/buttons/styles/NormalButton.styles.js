import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  // 긴 버튼 활성화 스타일 (기본 스타일)
  long: {
    minWidth: '80%',
    height: 55,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  // 짧은 버튼 활성화 스타일
  short: {
    minWidth: '40%',
    height: 55,
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: '2%',
  },
  // 버튼 비활성화 스타일
  disabled: { backgroundColor: colors.lightGray },
  // 버튼 텍스트 스타일
  text: {
    ...fonts.normalText,
    color: colors.white,
  },
});
