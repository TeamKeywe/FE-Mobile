import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

interface Styles {
  container: ViewStyle;
  contentTitle: TextStyle;
  verifyButton: ViewStyle;
}

export const styles = StyleSheet.create<Styles>({
  // 환자/보호자 버튼 아래 정보
  container: {
    marginBottom: '5%',
  },
  contentTitle: {
    ...fonts.smallTitle,
    color: colors.black,
    marginVertical: '5%',
  },
  verifyButton: {
    marginTop: '5%',
    marginBottom: 50,
  },
});
