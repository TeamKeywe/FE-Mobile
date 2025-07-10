import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.moreLightGray,
    marginBottom: -10,
  },
  // 권한 구역 + 출입 가능 여부 (패딩)
  infoTextPadding: {
    padding: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.moreLightGray,
    backgroundColor: colors.moreLightGreen,
  },
  // 권한 구역 (패딩)
  areaTextPadding: {
    width: '75%',
  },
  // 권한 구역 - 환자, 보호자 여부
  textTitle: {
    width: '70%',
    ...fonts.largeText,
    color: colors.black,
    lineHeight: 30,
  },
  // 권한 구역 - 구역 이름
  areaText: {
    ...fonts.mediumText,
    color: colors.black,
    lineHeight: 28,
    marginVertical: 2,
  },
  // 출입 가능 여부 (패딩)
  validateTextPadding: {
    maxWidth: '20%',
    alignSelf: 'center',
    marginLeft: 'auto',
  },
  // 출입 가능 여부 글자
  validateText: {
    ...fonts.smallTitle,
    color: colors.tertiary,
  },
  // 출입증 존재하지 않을 시 텍스트
  infoText: {
    marginTop: '10%',
    ...fonts.largeText,
    textAlign: 'center',
    color: colors.darkGray,
  },
  // 시작일, 만료일 정보
  text: {
    padding: '5%',
    paddingBottom: 0,
    lineHeight: 27,
    ...fonts.smallText,
    color: colors.black,
  },
});
