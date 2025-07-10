import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%', // 입력창 길이 부모에 맞춤
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 50,
    marginVertical: '2.5%',
    paddingLeft: '5%',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: colors.lightGreen,
    ...fonts.normalText,
    color: colors.black,
  },
  focused: { borderColor: colors.tertiary },
  error: { borderColor: colors.error },
  errorText: {
    marginLeft: '2%',
    marginTop: '1%',
    ...fonts.smallText,
    color: colors.error,
  },
  isNotEditable: {
    backgroundColor: colors.background,
    color: colors.darkGray,
  },
  eyeIcon: {
    position: 'absolute',
    right: '5%',
    top: '50%',
    transform: [{ translateY: -12 }], // 아이콘 height/2 만큼 위로 이동
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});
