import { useState, useEffect } from 'react';
import { View, Text, Modal } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { verifyPassword } from '../../apis/PasswordApi';
import { useAuthStore } from '../../stores/authStore';
import { useModalStore } from '../../stores/modalStore';
import { styles } from './styles/PasswordConfirmModal.styles';
import NormalInput from '../textinputs/NormalInput';
import NormalButton from '../buttons/NormalButton';
import WaveHeader from '../headers/WaveHeader';

const PasswordConfirmModal = ({ navigationRef }) => {
  const { isPasswordModalVisible, pendingTab, prevTab, isFromAppState, hidePasswordModal } =
    useModalStore();
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState(''); // mediumText ErrorText
  const setLastAuthTime = useAuthStore((state) => state.setLastAuthTime);

  useEffect(() => {
    if (isPasswordModalVisible) {
      setPassword('');
      setErrorText('');
    }
  }, [isPasswordModalVisible]);

  // 비밀번호 규칙 검사 핸들러 (8자 이상, 영문/숫자/특수문자 포함)
  const isValidPassword = (pw) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/.test(pw);

  // 비밀번호 입력 시 형식 검증
  const handlePasswordChange = (text) => {
    setPassword(text);

    if (!isValidPassword(text)) {
      setErrorText('8자 이상, 영문/숫자/특수문자를 포함해야 합니다.');
    } else {
      setErrorText('');
    }
  };

  const handleConfirm = async () => {
    if (!isValidPassword(password)) {
      setErrorText('8자 이상, 영문/숫자/특수문자를 포함해야 합니다.');
      return;
    }

    try {
      await verifyPassword(password);
      // 인증 성공 시 인증 시각 저장
      setLastAuthTime(Date.now());
      navigationRef.current?.navigate(pendingTab);
      hidePasswordModal();
    } catch (error) {
      setErrorText('비밀번호가 일치하지 않습니다. 다시 입력해 주세요.');
    }
  };

  const onClosePasswordModal = () => {
    hidePasswordModal();
    if (isFromAppState) {
      navigationRef.current?.navigate('MainPage'); // 홈으로 강제 이동
    } else {
      navigationRef.current?.navigate(prevTab); // 이전 탭으로 이동
    }
  };

  return (
    <Modal
      visible={isPasswordModalVisible}
      animationType="slide"
      onRequestClose={onClosePasswordModal}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled" //입력 도중 입력창 외 다른 부분을 터치 했을 때 내려감
        extraScrollHeight={40} // 키보드와 입력창 사이 간격
        enableOnAndroid={true} // 안드로이드 자동 스크롤 설정
      >
        <WaveHeader onBackPress={onClosePasswordModal} />
        <View style={styles.container}>
          <Text style={styles.title}>비밀번호 확인</Text>
          <Text style={styles.text}>개인정보 보호를 위해 비밀번호를 확인합니다.</Text>
          <NormalInput
            placeholder="비밀번호 입력"
            value={password}
            onChangeTextHandler={handlePasswordChange}
            errorText={errorText}
            style={styles.textInput}
            isSecureTextEntry={true}
            inputWrpperWidth={{ width: '80%' }}
          />
          <NormalButton title="확인" onPressHandler={handleConfirm} style={styles.button} />
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default PasswordConfirmModal;
