import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  shadowWrapperContainer: {
    height: '100%', // 카드 높이를 부모에 맞춤
  },
  shadowWrapper: {
    flex: 1,
    // 그림자 설정
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 7, // Android용
    borderRadius: 15,
    width: width * 0.7, // 카드 가로 크기 (화면의 70%)
    alignSelf: 'center',
  },
  cardContainer: {
    flex: 1, // 부모(shadowWrapper)의 크기를 꽉 채워 카드와 그림자 모양을 일치시킴
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // 배경 이미지가 카드 안에 잘리게
    position: 'relative', // 자식의 absolute 포지션 기준점
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject, // 전체 카드 덮게 만듦
    width: '125%',
    zIndex: 0, // 맨 뒤로
    opacity: 0.5,
  },
  cardText: {
    ...fonts.mediumTitle,
    color: colors.black,
    textAlign: 'center',
    marginBottom: '5%',
    lineHeight: 36,
  },
  cardSubText: {
    ...fonts.mediumText,
    color: colors.darkGray,
    textAlign: 'center',
    lineHeight: 30,
  },
  qrTitle: {
    ...fonts.mediumTitle,
    color: colors.black,
    marginBottom: '10%',
    zIndex: 1, // QR과 텍스트를 배경 위에
  },
  userName: {
    ...fonts.smallTitle,
    color: colors.black,
    marginVertical: '8%',
  },
  hospitalText: {
    ...fonts.mediumText,
    color: colors.darkGray,
    marginTop: '2%',
    marginBottom: '3%',
  },
  dateText: {
    ...fonts.smallText,
    color: colors.darkGray,
    marginTop: '2%',
  },
  flipHint: {
    marginTop: 16,
    ...fonts.smallText,
    color: '#888',
    textAlign: 'center',
  },
  // 뒷면
  qrFullWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // QR이 최대한 꽉 차게
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
  },
  backCard: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  flipHintBack: {
    marginTop: 10,
    ...fonts.smallText,
    color: '#888',
    textAlign: 'center',
    position: 'absolute',
    bottom: 24,
    width: '100%',
  },
});
