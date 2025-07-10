import { useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import CardFlip from 'react-native-card-flip';
import QRCode from 'react-native-qrcode-svg';
import { styles } from './styles/QrCard.styles';
import { colors } from '../../constants/colors';

// hasAccessAuthority: 출입 권한 여부, userVC : VC에 담을 사용자 정보, qrData : QR에 담을 JSON 문자열
const QrCard = ({
  hasAccessAuthority,
  did,
  userName,
  hospitalName,
  startDate,
  expireDate,
  passId,
  memberId,
  memberName,
  hospitalId,
  accessAreaCodes,
  visitCategory,
  startedAt,
  expiredAt,
}) => {
  // 해당 QR의 상세 페이지로 이동 (아직 미구현)
  //const navigation = useNavigation();
  //   const navigateToAccessListDeatail = () => {
  //     navigation.navigate('AccessListDetailPage');
  //   };

  // CardFlip의 ref 선언
  const cardFlipRef = useRef();
  // 임시: QR에 담을 JSON 문자열
  // const qrData = JSON.stringify({ did, userName, hospitalName, startDate, expireDate });

  // 임시: QR에 담을 JSON 문자열 - did 적용 전
  const qrData = JSON.stringify({
    passId,
    memberId,
    memberName,
    hospitalId,
    accessAreaCodes,
    visitCategory,
    startedAt,
    expiredAt,
  });

  // 출입 권한이 없을 때 안내 카드
  if (!hasAccessAuthority) {
    return (
      <View style={[styles.shadowWrapperContainer, { height: '90%', marginTop: '10%' }]}>
        <View style={styles.shadowWrapper}>
          <View style={styles.cardContainer}>
            <Image
              style={styles.backgroundImage}
              source={require('../../assets/images/mainBackground.png')}
              resizeMode="contain" // 이미지 비율 유지
            />
            <Text style={styles.cardText}>{'등록된 출입 권한이\n존재하지 않습니다.'}</Text>
            <Text style={styles.cardSubText}>
              {'방문 신청 버튼을 눌러\n출입 권한을 신청해 주세요.'}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <CardFlip style={styles.shadowWrapperContainer} ref={cardFlipRef} flipDirection="y">
      {/* 앞면 */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.shadowWrapper}
        onPress={() => cardFlipRef.current.flip()}
      >
        <View style={styles.cardContainer}>
          <Image
            style={styles.backgroundImage}
            source={require('../../assets/images/mainBackground.png')}
            resizeMode="contain" // 이미지 비율 유지
          />
          <ScrollView
            contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}
            style={{ width: '100%' }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.qrTitle}>출입 QR</Text>
            <QRCode
              value={qrData}
              // value={qrData_sample}
              size={140}
              color={colors.black}
              backgroundColor={colors.white}
            />
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.hospitalText}>{hospitalName}</Text>
            <Text style={styles.dateText}>시작일: {startDate}</Text>
            <Text style={styles.dateText}>만료일: {expireDate}</Text>
            <Text style={styles.flipHint}>카드를 눌러 뒤집기</Text>
          </ScrollView>
        </View>
      </TouchableOpacity>
      {/* 뒷면 */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.shadowWrapper}
        onPress={() => cardFlipRef.current.flip()}
      >
        <View style={styles.cardContainer}>
          <Image
            style={styles.backgroundImage}
            source={require('../../assets/images/mainBackground.png')}
            resizeMode="contain" // 이미지 비율 유지
          />
          <View style={styles.qrFullWrapper}>
            <QRCode
              value={qrData}
              // value={qrData_sample}
              size={250}
              color={colors.black}
              backgroundColor={colors.white}
            />
          </View>
          <Text style={styles.flipHintBack}>카드를 다시 눌러 앞면으로</Text>
        </View>
      </TouchableOpacity>
    </CardFlip>
  );
};

export default QrCard;
