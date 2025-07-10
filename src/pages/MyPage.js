import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { deleteUser, logoutUser } from '../apis/MyPageApi';
import { useAuthStore } from '../stores/authStore';
import { useNormalAlertStore } from '../stores/alertStore';
import { useAgentStore } from '../stores/agentStore';
import { deleteWallet } from '../credo/walletService';
import { styles } from './styles/MyPage.styles';
import WaveHeader from '../components/headers/WaveHeader';
import NormalInput from '../components/textinputs/NormalInput';
import GrayButton from '../components/buttons/GrayButton';

export default function MyPage() {
  const { clearAccessToken, userInfo } = useAuthStore();
  const { agent, clearAgent } = useAgentStore();
  const { setLoading } = useAuthStore();
  const showNormalAlert = useNormalAlertStore.getState().showNormalAlert;

  const navigation = useNavigation();

  const navigateToChangePassword = () => {
    navigation.navigate('ChangePasswordPage');
  };

  // 로그아웃 버튼 클릭 핸들러
  const handleLogout = () => {
    showNormalAlert({
      title: '로그아웃',
      message: '로그아웃 하시겠습니까?',
      onConfirmHandler: handleLogoutConfirm,
    });
  };

  const handleLogoutConfirm = async () => {
    setLoading(true);

    try {
      await logoutUser();
      clearAgent(); // 전역에서 Credo Agent 완전히 해제

      showNormalAlert({
        title: '로그아웃 성공',
        message: '로그아웃이 완료되었습니다.\n시작 페이지로 이동합니다.',
        showCancel: false,
        onConfirmHandler: () => {
          clearAccessToken();
        },
      });
    } catch (error) {
      showNormalAlert({
        title: '로그아웃 실패',
        message: `로그아웃 중\n오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.`,
        showCancel: false,
        confirmText: '확인',
      });
      console.log('로그아웃 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 회원 탈퇴 버튼 클릭 핸들러
  const handleDeleteUser = () => {
    showNormalAlert({
      title: '회원 탈퇴',
      message: '탈퇴 하시겠습니까?',
      onConfirmHandler: handleDeleteUserConfirm,
    });
  };

  const handleDeleteUserConfirm = async () => {
    try {
      await deleteUser();
      await deleteWallet(agent); // wallet 삭제
      clearAgent(); // 전역에서 Credo Agent 완전히 해제

      showNormalAlert({
        title: '회원 탈퇴 성공',
        message: '회원 탈퇴가 완료되었습니다.\n언제든 다시 찾아주세요:)',
        showCancel: false,
        onConfirmHandler: async () => {
          clearAccessToken();
        },
      });
    } catch (error) {
      showNormalAlert({
        title: '회원 탈퇴 실패',
        message: `회원 탈퇴 중\n오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.`,
        showCancel: false,
        confirmText: '확인',
      });
      console.log('회원 탈퇴 실패:', error);
    }
  };

  return (
    <ScrollView>
      <WaveHeader />
      <View style={styles.container}>
        <Text style={styles.title}>마이 페이지</Text>
        <NormalInput
          placeholder={`이름: ${userInfo?.name ?? ''}`}
          isEditable={false}
          inputWrpperWidth={{ width: '80%' }}
        />
        <NormalInput
          placeholder={`생년월일: ${userInfo?.birthDate ?? ''}`}
          isEditable={false}
          inputWrpperWidth={{ width: '80%' }}
        />
        <NormalInput
          placeholder={`전화번호: ${userInfo?.contact ?? ''}`}
          isEditable={false}
          inputWrpperWidth={{ width: '80%' }}
        />
        <NormalInput
          placeholder={`이메일: ${userInfo?.email ?? ''}`}
          isEditable={false}
          inputWrpperWidth={{ width: '80%' }}
        />
        <View style={styles.buttonContainer}>
          <GrayButton title="비밀번호 변경" onPressHandler={navigateToChangePassword} />
          <Text style={styles.buttonDivider}>|</Text>
          <GrayButton title="로그아웃" onPressHandler={handleLogout} />
          <Text style={styles.buttonDivider}>|</Text>
          <GrayButton title="회원 탈퇴" onPressHandler={handleDeleteUser} />
        </View>
      </View>
    </ScrollView>
  );
}
