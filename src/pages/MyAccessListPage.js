import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAccessList } from '../apis/MyAccessListApi';
import { getHospitalList } from '../apis/AccessRequestApi';
import { useAuthStore } from '../stores/authStore';
import { useNormalAlertStore } from '../stores/alertStore';
import { useHospitalStore } from '../stores/hospitalStore';
import { styles } from './styles/MyAccessListPage.styles';
import MyAccessDetailModal from '../components/modals/MyAccessDetailModal';
import NormalListDeep from '../components/lists/NormalListDeep';

//병원 Id로 병원 이름 찾기
function getHospitalNameByList(hospitalId, hospitalNameList) {
  const hospital = hospitalNameList.find((hospital) => hospital.hospitalId === hospitalId);
  return hospital ? hospital.hospitalName : `병원명 로딩 중 . . .병원: #${hospitalId}`;
}

const MyAccessListPage = () => {
  const { setLoading } = useAuthStore();
  const showNormalAlert = useNormalAlertStore.getState().showNormalAlert;
  const hospitalList = useHospitalStore.getState().hospitalList;

  const navigation = useNavigation();

  const [myAccessList, setMyAccessList] = useState([]);
  const [hospitalNameList, setHospitalNameList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Alert 관리 상태변수
  const [showModal, setShowModal] = useState(false); // 모달 표시 여부
  const [selectedAccess, setSelectedAccess] = useState(null); // 클릭된 출입증

  // 병원 목록 불러오기
  useEffect(() => {
    const getHospitalsName = async () => {
      setLoading(true);
      setIsLoading(true);

      try {
        const data = await getHospitalList();
        setHospitalNameList(data);
      } catch (error) {
        setHospitalNameList(hospitalList);
      } finally {
        //if (myAccessList) setLoading(false);
      }
    };
    getHospitalsName();
  }, []);

  // 출입증 목록 불러오기
  useEffect(() => {
    setLoading(true);
    setIsLoading(true);

    const getMyAccessList = async () => {
      try {
        const data = await getAccessList();
        // accessAreaNames 필드 추가
        const converted = addAccessAreaNamesField(data);
        setMyAccessList(converted);
      } catch (error) {
        showNormalAlert({
          title: '출입증 목록 조회 실패',
          message: `출입증 목록 조회 중\n오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.`,
          showCancel: false,
          confirmText: '확인',
        });
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };
    getMyAccessList();
  }, []);

  //새로고침 함수
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getAccessList();
      // accessAreaNames 필드 추가
      const converted = addAccessAreaNamesField(data);
      setMyAccessList(converted);
    } catch (error) {
      showNormalAlert({
        title: '출입증 새로고침 실패',
        message: `출입증 새로고침 중\n오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.`,
        showCancel: false,
        confirmText: '확인',
      });
    } finally {
      setRefreshing(false);
    }
  };

  // 출입증 객체에 accessAreaNames 필드 추가
  function addAccessAreaNamesField(list) {
    return (list || []).map((item) => ({
      ...item,
      accessAreaNames: item.accessAreas ? item.accessAreas.map((area) => area.areaName) : [],
    }));
  }

  // 출입 권한 클릭 시 모달 띄우기
  const handleItemPress = (section, item, index) => {
    const access = item.data;
    const isPatient = access.visitCategory === 'PATIENT';
    const isGuardian = access.visitCategory === 'GUARDIAN';

    setSelectedAccess({
      hospitalName: section.contentTitle,
      area: (access.accessAreaNames || []).map((name) => `${name}`).join('\n'),
      visitorType: getVisitCategoryLabel(access.visitCategory),
      startDate: formatDateTime(access.startedAt),
      expireDate: formatDateTime(access.expiredAt),
      approval: getApprovalStatus(access.startedAt, access.expiredAt, access.issuanceStatus),
      patientNumber: access.patientId,
      issuer: access.memberId,
      passId: access.passId,
      guardians: isPatient ? access.guardians : undefined,
      patientName: isGuardian ? access.patientName : undefined,
      issuanceStatus: access.issuanceStatus,
      startedAt: access.startedAt,
      expiredAt: access.expiredAt,
    });

    setShowModal(true);
  };

  // visitCategory 변환 함수
  const getVisitCategoryLabel = (category) => {
    switch (category) {
      case 'PATIENT':
        return '환자';
      case 'GUARDIAN':
        return '보호자';
      default:
        return category; // 혹시 모르는 값은 그대로 표기
    }
  };

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

  // 출입 가능 상태 함수
  const getApprovalStatus = (startedAt, expiredAt, issuanceStatus) => {
    const now = new Date();
    const start = new Date(startedAt);
    const end = new Date(expiredAt);
    if (issuanceStatus === 'ISSUED') {
      if (start > now) {
        return '출입\n대기';
      } else if (end < now) {
        return '만료';
      } else {
        return '출입\n가능';
      }
    } else if (issuanceStatus === 'PENDING') return '승인\n대기';
    else if (issuanceStatus === 'PROCESSING') return '발급중';
    else return '거절';
  };

  //병원 Id로 병원 이름 찾기
  const getHospitalName = (hospitalId) => getHospitalNameByList(hospitalId, hospitalNameList);

  // 만료/거절 제외 & 시작일 오름차순 정렬
  // 상태 우선순위 함수 추가
  const getStatusPriority = (startedAt, expiredAt, issuanceStatus) => {
    const status = getApprovalStatus(startedAt, expiredAt, issuanceStatus);
    switch (status) {
      case '출입\n가능':
        return 0;
      case '출입\n대기':
        return 1;
      case '발급중':
        return 2;
      case '승인\n대기':
        return 3;
      default:
        return 99;
    }
  };

  // 정렬 및 필터링
  const filteredAndSortedList = (myAccessList || [])
    .filter((item) => {
      const status = getApprovalStatus(item.startedAt, item.expiredAt, item.issuanceStatus);
      return (
        status === '출입\n가능' ||
        status === '출입\n대기' ||
        status === '발급중' ||
        status === '승인\n대기'
      );
    })
    .sort((a, b) => {
      const aPriority = getStatusPriority(a.startedAt, a.expiredAt, a.issuanceStatus);
      const bPriority = getStatusPriority(b.startedAt, b.expiredAt, b.issuanceStatus);
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      return new Date(a.startedAt) - new Date(b.startedAt);
    });

  // NormalListDeep에 넘길 데이터 가공
  const sections = filteredAndSortedList.reduce((acc, cur) => {
    //acc - accumulator(누적값, 병원별로 묶안 배열), cur - current(현재 배열에서 처리중인 값)
    const hospitalId = cur.hospitalId;
    let hospitalName = getHospitalName(hospitalId); //id로 이름 찾아서 저장
    let section = acc.find((sec) => sec.hospitalId === hospitalId); //현재 hospitalId와 같은 section이 있는지 찾는다.
    if (!section) {
      //섹션이 없으면 새로운 섹션 객체를 만들어 acc에 추가한다.
      section = {
        hospitalId,
        contentTitle: hospitalName,
        accessList: [],
      };
      acc.push(section);
    }
    section.accessList.push(cur); //해당 병원 그룹의 accessList 배열에 현재 출입증 추가
    return acc; //누적값 반환해서 다음 루프에 이어감
  }, []);

  return (
    <>
      {isLoading || !myAccessList ? (
        <Text style={styles.infoText}>출입증 목록을 불러오는 중입니다. . .</Text>
      ) : sections.length > 0 ? (
        <NormalListDeep
          cardStyle={{
            paddingHorizontal: 0,
            borderBottomWidth: 0,
          }}
          sections={sections.map((section) => ({
            ...section,
            accessList: section.accessList.map((item) => ({ data: item })),
          }))}
          onItemPress={handleItemPress}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={(itemObj, idx, selected) => {
            const item = itemObj.data;
            return (
              <View style={styles.container}>
                <View style={styles.infoTextPadding}>
                  <View style={styles.areaTextPadding}>
                    <Text style={styles.textTitle}>
                      {'[ ' + getVisitCategoryLabel(item.visitCategory) + ' ]'}
                    </Text>
                    {(item.accessAreaNames || []).map((area, idx) => (
                      <Text key={idx} style={styles.areaText}>
                        {area}
                      </Text>
                    ))}
                  </View>
                  <View style={styles.validateTextPadding}>
                    <Text style={styles.validateText}>
                      {getApprovalStatus(item.startedAt, item.expiredAt, item.issuanceStatus)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.text}>
                  시작일: {formatDateTime(item.startedAt)}
                  {'\n'}만료일: {formatDateTime(item.expiredAt)}
                  {'\n'}
                </Text>
              </View>
            );
          }}
        />
      ) : (
        <Text style={styles.infoText}>유효한 출입증이 존재하지 않습니다.</Text>
      )}

      <MyAccessDetailModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false);
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainPage', params: { passId: selectedAccess?.passId } }],
          });
        }}
        data={selectedAccess}
      />
    </>
  );
};

export default MyAccessListPage;
