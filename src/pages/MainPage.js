import { useState, useEffect, useCallback } from 'react';
import { View, Image } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getAccessList } from '../apis/MyAccessListApi';
import { getHospitalList } from '../apis/AccessRequestApi';
import { useAuthStore } from '../stores/authStore';
import { useNormalAlertStore } from '../stores/alertStore';
import { styles } from './styles/MainPage.styles';
import QrCards from '../components/cards/QrCards';

// TODO: 리펙토링 할 때 같은 코드는 export해서 import해서 쓰기
// 병원 Id로 병원 이름 찾기
function getHospitalNameByList(hospitalId, hospitalNameList) {
  const hospital = hospitalNameList.find((hospital) => hospital.hospitalId === hospitalId);
  return hospital ? hospital.hospitalName : `병원명 로딩 중 . . .병원: #${hospitalId}`;
}

// 출입증 객체에 accessAreaCodes 필드 추가
function addAccessAreaCodesField(list) {
  return (list || []).map((item) => ({
    ...item,
    accessAreaCodes: item.accessAreas ? item.accessAreas.map((area) => area.areaCode) : [],
  }));
}

// 출입증 데이터로 임시 VC 생성
// function generateUserVCfromAccessList(AccessList, hospitalNameList, userName) {
//   const randomNum = Math.floor(100000 + Math.random() * 900000);
//   return AccessList.map((item, idx) => ({
//     did: `did:example:${String(item.passId).padStart(16, '0')}-${randomNum}`,
//     passId: item.passId,
//     userName,
//     hospitalName: getHospitalNameByList(item.hospitalId, hospitalNameList),
//     startDate: formatDateTime(item.startedAt),
//     expireDate: formatDateTime(item.expiredAt),
//     issuedAt: Date.now(),
//   }));
// }

// 출입증 데이터로 임시 VC 생성 - did 적용 전
function generateUserVCfromAccessList(AccessList, hospitalNameList, userName) {
  const withCodes = addAccessAreaCodesField(AccessList);
  return withCodes.map((item) => {
    // 카드에 표시될 데이터
    const hospitalName = getHospitalNameByList(item.hospitalId, hospitalNameList);
    const startDate = formatDateTime(item.startedAt);
    const expireDate = formatDateTime(item.expiredAt);

    // QR에 쓸 원본 데이터
    const qrPayload = {
      passId: item.passId,
      memberId: item.memberId,
      memberName: userName,
      hospitalId: item.hospitalId,
      accessAreaCodes: item.accessAreaCodes,
      visitCategory: item.visitCategory,
      startedAt: item.startedAt,
      expiredAt: item.expiredAt,
    };

    return {
      ...qrPayload,
      // 카드에 표시될 정보
      userName,
      hospitalName,
      startDate,
      expireDate,
      did: `did:example:${String(item.passId).padStart(16, '0')}`,
    };
  });
}

// 날짜 포맷 함수 (YYYY-MM-DD HH:mm)
const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

function isQrAvailable(item) {
  if (item.issuanceStatus !== 'ISSUED') return false;
  const now = new Date();
  const start = new Date(item.startedAt);
  const end = new Date(item.expiredAt);
  return start <= now && now <= end;
}

const MainPage = () => {
  const { loading, setLoading, userInfo } = useAuthStore();
  const showNormalAlert = useNormalAlertStore.getState().showNormalAlert;

  // 임시: 상태변수로 출입 권한 제어
  const [hasAccessAuthority, setHasAccessAuthority] = useState(true);

  // 임시: QR에 담을 JSON 문자열
  //const qrData = JSON.stringify(userVC);

  const [hospitalNameList, setHospitalNameList] = useState([]);
  const [myAccessList, setMyAccessList] = useState([]);
  const [userVC, setUserVC] = useState([]);
  const [userName, setUserName] = useState('');

  const navigation = useNavigation();
  const route = useRoute();

  // initialPassId를 route에서 꺼냄
  const initialPassId = route?.params?.passId;

  // userVC가 바뀔 때마다 initialIndex 계산
  const initialIndex =
    userVC && initialPassId
      ? userVC.findIndex((vc) => String(vc.passId) === String(initialPassId))
      : 0;

  // 병원, 출입증 데이터 불러오기
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (!myAccessList || myAccessList.length === 0) {
          setLoading(true);
        }

        try {
          // 병원, 유저 정보 병렬로 불러오기
          const hospitalList = await getHospitalList();
          setHospitalNameList(hospitalList);
          setUserName(userInfo?.name || '이름 로딩 중 . . .');

          const accessList = await getAccessList();
          setMyAccessList(accessList);

          // 목업 출입증 데이터 불러오기
          // setMyAccessList(mockAccessList);
        } catch (error) {
          showNormalAlert({
            title: '출입 QR 조회 실패',
            message: `출입 QR 조회 중\n오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.`,
            showCancel: false,
            confirmText: '확인',
          });
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [setLoading]),
  );

  // hospitalNameList, myAccessList 준비되면 userVC 생성
  useEffect(() => {
    if (hospitalNameList.length > 0 && myAccessList.length > 0 && userName) {
      // 출입 가능한 리스트
      const accessibleList = myAccessList.filter((item) => isQrAvailable(item));
      setUserVC(generateUserVCfromAccessList(accessibleList, hospitalNameList, userName));
      setHasAccessAuthority(accessibleList.length > 0);
    }
  }, [hospitalNameList, myAccessList, userName]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.logoImage}
        source={require('../assets/images/logoGreen.png')}
        resizeMode="contain" // 이미지 비율 유지
      />
      <QrCards
        hasAccessAuthority={hasAccessAuthority}
        userVC={userVC}
        initialIndex={initialIndex >= 0 ? initialIndex : 0} // 처음 보여줄 카드 인덱스
      />
    </View>
  );
};

export default MainPage;
