import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  // ScrollView 스타일
  scrollView: {
    minWidth: '80%',
    paddingBottom: 20,
  },
  // ScrollView 내부 전체 컨텐츠 박스 스타일
  contentContainer: {
    paddingBottom: 60,
  },
  // 각 아이템 박스 스타일
  itemBox: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  // 각 아이템 텍스트 스타일
  itemText: {
    ...fonts.largeText,
    color: colors.black,
  },
  // // 선택된 아이템 박스 스타일
  // selectedItemBox: { backgroundColor: colors.lightGreen },
  // // 선택된 아이템 텍스트 스타일
  // selectedItemText: { color: colors.secondary },
});
