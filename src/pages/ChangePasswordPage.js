import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { updatePassword } from '../apis/PasswordApi';
import { useAuthStore } from '../stores/authStore';
import { useNormalAlertStore } from '../stores/alertStore';
import { styles } from './styles/ChangePasswordPage.styles';
import WaveHeader from '../components/headers/WaveHeader';
import NormalInput from '../components/textinputs/NormalInput';
import NormalButton from '../components/buttons/NormalButton';

const ChangePasswordPage = () => {
  const { setLoading } = useAuthStore();
  const showNormalAlert = useNormalAlertStore.getState().showNormalAlert;

  const [originalPassword, setOriginalPassword] = useState(''); // 기존 비밀번호
  const [newPassword, setNewPassword] = useState(''); // 새 비밀번호
  const [confirmNewPassword, setConfirmNewPassword] = useState(''); // 새 비밀번호 확인
  const [isVerified, setIsVerified] = useState(false); // 새 비밀번호 확인 인증 여부
  const [isSubmitted, setIsSubmitted] = useState(false); // 제출 버튼 눌렀는지 여부

  const navigation = useNavigation();

  // 비밀번호 규칙 검사 핸들러 (8자 이상, 영문/숫자/특수문자 포함)
  const isValidPassword = (pw) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/.test(pw);

  useEffect(() => {
    setIsVerified(confirmNewPassword === newPassword);
  }, [confirmNewPassword, newPassword]);

  const navigateToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainPage' }],
    });
  };

  // 변경 버튼 클릭 핸들러
  const handlePressButton = () => {
    setIsSubmitted(true);

    // 비밀번호 변경이 불가능한 경우 return
    if (!newPassword || !isValidPassword(newPassword) || !isVerified) {
      return;
    }

    showNormalAlert({
      title: '비밀번호 변경',
      message: '비밀번호를 변경하시겠습니까?',
      onConfirmHandler: handleConfirmChange,
    });
  };

  // 비밀번호 변경 확인 버튼 클릭 핸들러
  const handleConfirmChange = async () => {
    setLoading(true);
    try {
      await updatePassword({ originalPassword, newPassword });

      setTimeout(() => {
        showNormalAlert({
          title: '비밀번호 변경 완료',
          message: `비밀번호가 변경되었습니다.\n메인 페이지로 이동합니다.`,
          showCancel: false,
          onConfirmHandler: navigateToHome,
        });
      }, 300);
    } catch (error) {
      const status = error.response.data.status;
      let message = `비밀번호 변경 중\n오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.`;

      if (status === 400) {
        message = '기존 비밀번호를 다시 입력해 주세요.';
      } else if (status === 409) {
        message = `기존과 동일한 비밀번호는\n사용하실 수 없습니다.`;
      }

      showNormalAlert({
        title: '비밀번호 변경 실패',
        message,
        showCancel: false,
        confirmText: '확인',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled" //입력 도중 입력창 외 다른 부분을 터치 했을 때 내려감
        extraScrollHeight={40} // 키보드와 입력창 사이 간격
        enableOnAndroid={true} // 안드로이드 자동 스크롤 설정
      >
        <WaveHeader />
        <View style={styles.container}>
          <Text style={styles.title}>비밀번호 변경</Text>
          <Text style={styles.text}>새로운 비밀번호를 입력해 주세요.</Text>
          <NormalInput
            placeholder="기존 비밀번호"
            value={originalPassword}
            onChangeTextHandler={setOriginalPassword}
            errorText={
              isSubmitted && (!originalPassword || !isValidPassword(originalPassword))
                ? '기존 비밀번호를 입력하고 형식을 확인해 주세요'
                : ''
            }
            isSecureTextEntry={true}
            inputWrpperWidth={{ width: '80%' }}
          />
          <NormalInput
            placeholder="새 비밀번호 (영문, 숫자, 특수문자 조합)"
            value={newPassword}
            onChangeTextHandler={setNewPassword}
            errorText={
              isSubmitted && (!newPassword || !isValidPassword(newPassword))
                ? '새 비밀번호를 입력하고 형식을 확인해 주세요'
                : ''
            }
            isSecureTextEntry={true}
            inputWrpperWidth={{ width: '80%' }}
          />
          <NormalInput
            placeholder="새 비밀번호 확인"
            value={confirmNewPassword}
            onChangeTextHandler={setConfirmNewPassword}
            errorText={
              isSubmitted && (!confirmNewPassword || !isVerified)
                ? '비밀번호가 일치하지 않습니다'
                : ''
            }
            isSecureTextEntry={true}
            inputWrpperWidth={{ width: '80%' }}
          />
          <NormalButton title="변경" style={styles.button} onPressHandler={handlePressButton} />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default ChangePasswordPage;
