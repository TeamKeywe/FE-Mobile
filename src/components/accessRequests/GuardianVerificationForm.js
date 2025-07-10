import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { verifyPatientCode } from '../../apis/AccessRequestApi';
import { useAuthStore } from '../../stores/authStore';
import { useNormalAlertStore } from '../../stores/alertStore';
import { styles } from './styles/GuardianVerificationForm.styles';
import NormalInput from '../textinputs/NormalInput';

const GuardianVerificationForm = ({ hospitalId, onVerifiedHandler }) => {
  const { setLoading } = useAuthStore();
  const showNormalAlert = useNormalAlertStore.getState().showNormalAlert;

  const [patientCode, setPatientCode] = useState(''); // 환자 번호 관리
  const [isVerified, setIsVerified] = useState(false);

  // 환자 번호 검증 버튼 클릭 핸들러
  const handleVerifyPatient = async () => {
    setLoading(true);
    try {
      await verifyPatientCode(patientCode, hospitalId);

      // 유효한 환자 번호
      setIsVerified(true);
      showNormalAlert({
        title: '환자 번호 검증 성공',
        message: '환자 번호가 정상적으로 확인되었습니다.\n방문 날짜를 선택해 주세요.',
        showCancel: false,
        confirmText: '확인',
        onConfirmHandler: () => {
          onVerifiedHandler(patientCode); // 부모에게 환자 정보 전달
        },
      });
    } catch (error) {
      // 유효하지 않은 환자 번호
      setIsVerified(false);
      showNormalAlert({
        title: '환자 번호 검증 실패',
        message: '일치하는 환자 정보가\n존재하지 않습니다.\n확인 후 다시 입력해 주세요.',
        showCancel: false,
        confirmText: '다시 입력',
        onConfirmHandler: () => {
          setPatientCode('');
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.contentTitle}>환자 번호 입력</Text>
      <View style={styles.inputWithButtonConatiner}>
        <NormalInput
          placeholder="환자 번호를 입력하세요."
          value={patientCode}
          onChangeTextHandler={setPatientCode}
          isEditable={isVerified ? false : true}
          inputWrpperWidth={{ width: '90%' }}
        />
        <TouchableOpacity onPress={handleVerifyPatient} style={styles.verifyButton}>
          <Text style={styles.verifyButtonText}>검증</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GuardianVerificationForm;
