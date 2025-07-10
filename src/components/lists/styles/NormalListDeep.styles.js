import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  // ScrollView 스타일
  scrollView: { padding: 16 },
  // ScrollView 내부 전체 컨텐츠 박스 스타일
  contentContainer: { paddingBottom: 60 },
  // 각 아이템 박스 스타일
  itemBox: {
    marginBottom: -40,
  },
  // 각 아이템 텍스트 스타일
  itemText: {
    ...fonts.mediumTitle,
    color: colors.black,
    paddingTop: '7%',
    paddingBottom: '2%',
    paddingHorizontal: '5%',
  },
  //   // 선택된 아이템 박스 스타일
  //   selectedItemBox: { backgroundColor: colors.lightGreen },
  // // 선택된 아이템 텍스트 스타일
  // selectedItemText: { color: colors.secondary },
});
