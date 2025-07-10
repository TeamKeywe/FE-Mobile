import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '10%',
    paddingTop: '5%',
  },
  scrollView: { paddingBottom: 50 },
  title: {
    ...fonts.mediumTitle,
    color: colors.black,
    margin: '5%',
    alignSelf: 'center',
  },
  // 구분선
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: colors.black,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '10%',
  },
  contentContainer: {
    marginTop: '10%',
  },
  contentTitle: {
    ...fonts.smallTitle,
    color: colors.black,
    marginVertical: '5%',
  },
  submitButton: {
    marginTop: '10%',
    marginBottom: 50,
  },
  noDatesText: {
    ...fonts.smallText,
    color: colors.darkGray,
    alignSelf: 'center',
    marginTop: '5%',
    marginBottom: '3%',
  },
});
