import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

interface Styles {
  scrollView: ViewStyle;
  container: ViewStyle;
  logoTextImage: ImageStyle;
  text: TextStyle;
  logoIconImage: ImageStyle;
  buttonContainer: ViewStyle;
}

export const styles = StyleSheet.create<Styles>({
  scrollView: { alignItems: 'center' },
  container: {
    marginTop: '30%', // 헤더 사라진 길이 만큼 margin 지정
    paddingVertical: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTextImage: {
    width: '60%',
    height: '10%',
    marginBottom: '5%',
  },
  text: {
    ...fonts.mediumText,
    color: colors.darkGray,
  },
  logoIconImage: {
    width: '60%',
    height: '30%',
    marginVertical: '25%',
  },
  buttonContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
