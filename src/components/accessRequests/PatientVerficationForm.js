import { useState } from 'react';
import { View, Text } from 'react-native';
import { verifyPatientInfo } from '../../apis/AccessRequestApi';
import { useAuthStore } from '../../stores/authStore';
import { useNormalAlertStore } from '../../stores/alertStore';
import { styles } from './styles/PatientVerficationForm.styles';
import NormalButton from '../buttons/NormalButton';
import NormalInput from '../textinputs/NormalInput';

const PatientVerficationForm = ({ hospitalId, onVerifiedHandler }) => {
  const { setLoading, userInfo } = useAuthStore();
  const showNormalAlert = useNormalAlertStore.getState().showNormalAlert;

  const [isVerified, setIsVerified] = useState(false);

  const handleVerifyPatient = async () => {
    setLoading(true);
    try {
      await verifyPatientInfo(hospitalId);

      // 유효한 환자 정보
      setIsVerified(true);
      showNormalAlert({
        title: '환자 정보 검증 성공',
        message: '정보가 정상적으로 확인되었습니다.\n방문 날짜를 선택해 주세요.',
        showCancel: false,
        confirmText: '확인',
        onConfirmHandler: () => {
          onVerifiedHandler(userInfo); // 부모에게 환자 정보 전달
        },
      });
    } catch (error) {
      // 유효하지 않은 환자 정보
      setIsVerified(false);
      showNormalAlert({
        title: '환자 정보 검증 실패',
        message: '일치하는 환자 정보가\n존재하지 않습니다.\n해당 병원에 문의해 주세요.',
        showCancel: false,
        confirmText: '확인',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.contentTitle}>개인 정보 확인</Text>
      <NormalInput placeholder={`이름: ${userInfo?.name ?? ''}`} isEditable={false} />
      <NormalInput placeholder={`생년월일: ${userInfo?.birthDate ?? ''}`} isEditable={false} />
      <NormalInput placeholder={`전화번호: ${userInfo?.contact ?? ''}`} isEditable={false} />
      {/* 검증되지 않은 경우에만 검증 버튼 표시 */}
      {!isVerified && (
        <NormalButton
          title="환자 정보 검증"
          onPressHandler={handleVerifyPatient}
          style={styles.verifyButton}
        />
      )}
    </View>
  );
};

export default PatientVerficationForm;
