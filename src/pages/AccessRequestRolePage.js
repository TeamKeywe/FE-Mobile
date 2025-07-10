import { useEffect, useState, useRef } from 'react';
import { View, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { getAvailableDates } from '../apis/AccessRequestApi';
import { createAccessPass } from '../apis/AccessRequestApi';
import { useAuthStore } from '../stores/authStore';
import { useNormalAlertStore } from '../stores/alertStore';
import { useAgentStore } from '../stores/agentStore';
import { createCredoAgent } from '../credo/agentService';
import { startHospitalPolling, getAllVCs } from '../credo/hospitalConnectService';
import { styles } from './styles/AccessRequestRolePage.styles';
import NormalButton from '../components/buttons/NormalButton';
import NormalCheckbox from '../components/checkboxes/NormalCheckbox';
import PatientVerficationForm from '../components/accessRequests/PatientVerficationForm';
import GuardianVerificationForm from '../components/accessRequests/GuardianVerificationForm';

const AccessRequestRolePage = ({ route }) => {
  const { hospitalId, hospitalName } = route.params;

  const { setLoading } = useAuthStore();
  const { setAgent } = useAgentStore();

  const [role, setRole] = useState('PATIENT');
  const [isVerified, setIsVerified] = useState(false); // 검증 여부
  const [verifiedData, setVerifiedData] = useState(null); // 자식 컴포넌트의 검증 정보
  const [checkedDate, setCheckedDate] = useState([]);
  const [availableDates, setAvailableDates] = useState([]); // 방문 가능 날짜 설정

  const navigation = useNavigation();
  const showNormalAlert = useNormalAlertStore.getState().showNormalAlert;

  // 방문 가능 날짜 불러오기
  useEffect(() => {
    // isVerified가 true일 때만 실행
    if (!isVerified) {
      setAvailableDates([]); // 검증 전엔 날짜 초기화
      return;
    }

    const fetchAvailableDates = async () => {
      setLoading(true);
      try {
        const dates = await getAvailableDates(hospitalId);
        setAvailableDates(dates);
      } catch (error) {
        showNormalAlert({
          title: '방문 일시 조회 실패',
          message: `방문 가능 일시 조회 중\n오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.`,
          showCancel: false,
          confirmText: '확인',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableDates();
  }, [isVerified, hospitalId]);

  const navigateToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainPage' }],
    });
  };

  const handlePatientButton = () => {
    setIsVerified(false);
    setVerifiedData(null);
    setRole('PATIENT');
  };

  const handleGuardianButton = () => {
    setIsVerified(false);
    setVerifiedData(null);
    setRole('GUARDIAN');
  };

  const handleVerified = (data) => {
    setIsVerified(true);
    setVerifiedData(data);
  };

  const handleDateCheckbox = (newCheckedList) => {
    setCheckedDate(newCheckedList);
  };

  // 방문증 신청 버튼 클릭 핸들러
  const handleSubmitButton = () => {
    // 날짜 선택 안 하고, 신청 버튼 클릭 시 alert 출력
    if (!checkedDate.some(Boolean)) {
      showNormalAlert({
        title: '방문증 신청 불가',
        message: `방문 일시 선택 후\n방문증을 신청해 주세요.`,
        showCancel: false,
      });
    } else {
      showNormalAlert({
        title: '방문증 신청',
        message: `입력하신 정보로\n방문증을 신청하시겠습니까?`,
        onConfirmHandler: handleConfirmChange,
      });
    }
  };

  const pollStopRef = useRef(null); // polling 중단용 ref

  const handleConfirmChange = async () => {
    try {
      setLoading(true);

      const selectedIdx = checkedDate.findIndex(Boolean);
      const selectedDate = selectedIdx >= 0 ? availableDates[selectedIdx] : null;

      const form = {
        hospitalId,
        visitCategory: role,
        patientCode: verifiedData,
        checkedDate: selectedDate,
      };

      let res;
      try {
        res = await createAccessPass(form);
        showNormalAlert({
          title: '방문증 신청 완료',
          message: `방문증 신청이 완료되었습니다.\n메인 페이지로 이동합니다.`,
          showCancel: false,
          onConfirmHandler: navigateToHome,
        });
        console.log('방문증 신청 결과:', res?.data);
      } catch (error) {
        console.log('방문증 신청 중 오류 발생:', error);
      }

      const agent = await createCredoAgent();
      setAgent(agent);

      if (!agent) {
        console.log('Agent가 없음');
        throw new Error('Agent가 초기화되지 않았습니다.');
      }

      if (!res?.data?.passId) {
        console.log('passId 없음, res:', res);
        throw new Error('passId가 없습니다.');
      }

      // ✅ Polling 시작
      pollStopRef.current = startHospitalPolling({
        agent,
        passId: res.data.passId,
        hospitalId,
      });
      console.log('startHospitalPolling 호출 후 pollStopRef:', pollStopRef.current);
    } catch (error) {
      showNormalAlert({
        title: '방문증 신청 실패',
        message: '방문증 신청 중\n오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.',
        showCancel: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔁 컴포넌트 언마운트 시 polling 중단
  // useEffect(() => {
  //   return () => {
  //     if (pollStopRef.current) {
  //       pollStopRef.current(); // clearInterval 호출
  //     }
  //   };
  // }, []);

  return (
    <>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled" //입력 도중 입력창 외 다른 부분을 터치 했을 때 내려감
        extraScrollHeight={40} // 키보드와 입력창 사이 간격
        enableOnAndroid={true} // 안드로이드 자동 스크롤 설정
      >
        <Text style={styles.title}>{hospitalName}</Text>
        <View style={styles.divider} />
        <View style={styles.buttonContainer}>
          <NormalButton
            title="환자"
            length="short"
            onPressHandler={handlePatientButton}
            isDisabled={role === 'GUARDIAN'}
          />
          <NormalButton
            title="보호자"
            length="short"
            onPressHandler={handleGuardianButton}
            isDisabled={role === 'PATIENT'}
          />
        </View>

        {/* 환자 신청 정보 검증 컴포넌트 & 보호자 신청 정보 검증 컴포넌트 분리 */}
        <View style={styles.contentContainer}>
          {role === 'PATIENT' ? (
            <PatientVerficationForm hospitalId={hospitalId} onVerifiedHandler={handleVerified} />
          ) : (
            <GuardianVerificationForm hospitalId={hospitalId} onVerifiedHandler={handleVerified} />
          )}

          {/* 검증 성공 후에만 방문일시 + 신청 버튼 표시 */}
          {isVerified && (
            <>
              <Text style={styles.contentTitle}>방문 일시 선택</Text>
              {availableDates.length === 0 && (
                <>
                  <Text style={styles.noDatesText}>선택 가능한 방문일시가 없습니다.</Text>
                  <NormalButton title="방문증 신청" style={styles.submitButton} isDisabled={true} />
                </>
              )}
              {availableDates.length > 0 && (
                <>
                  <NormalCheckbox labels={availableDates} onChangeHandler={handleDateCheckbox} />
                  <NormalButton
                    title="방문증 신청"
                    onPressHandler={handleSubmitButton}
                    style={styles.submitButton}
                  />
                </>
              )}
            </>
          )}
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default AccessRequestRolePage;
