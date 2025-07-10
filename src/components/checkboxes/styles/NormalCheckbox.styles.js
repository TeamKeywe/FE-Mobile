import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  // ScrollView 내부 전체 컨텐츠 박스 스타일
  //contentContainer: { paddingVertical: 20 },
  // 체크박스 + 텍스트 감싼 컨테이너 스타일
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // 왼쪽 정렬
    paddingVertical: 10, // 위아래 padding
    paddingHorizontal: 20, // 좌우 padding
  },
  // 체크박스 아이콘 스타일
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 체크 되었을 때 스타일
  checked: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  // 문자열 스타일
  label: {
    ...fonts.normalText,
    color: colors.black,
  },
});
