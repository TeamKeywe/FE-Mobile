import { useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createMemberInfo } from '../apis/SignUpApi';
import { useAuthStore } from '../stores/authStore';
import { useNormalAlertStore } from '../stores/alertStore';
import { styles } from './styles/SignUpPage.styles';
import WaveHeader from '../components/headers/WaveHeader';
import NormalInput from '../components/textinputs/NormalInput';
import NormalButton from '../components/buttons/NormalButton';
import GrayButton from '../components/buttons/GrayButton';

// 주민등록번호에서 생년월일 추출 (YYMMDD + 성별코드로 19/20세기 구분)
const getBirthDateFromRRN = (rrn) => {
  if (!rrn || rrn.length < 7) return '';
  const birthPart = rrn.replace(/[^0-9]/g, '').slice(0, 6); // YYMMDD
  const genderCode = rrn.replace(/[^0-9]/g, '')[6]; // 7번째 숫자
  if (!birthPart || !genderCode) return '';

  let year = parseInt(birthPart.slice(0, 2), 10);
  const month = birthPart.slice(2, 4);
  const day = birthPart.slice(4, 6);

  // 성별코드로 19/20/21세기 구분
  let fullYear = '';
  if (genderCode === '1' || genderCode === '2') fullYear = 1900 + year;
  else if (genderCode === '3' || genderCode === '4') fullYear = 2000 + year;
  else if (genderCode === '5' || genderCode === '6') fullYear = 1900 + year; // 외국인
  else if (genderCode === '7' || genderCode === '8') fullYear = 2000 + year; // 외국인

  if (!fullYear) return '';
  return `${fullYear}-${month}-${day}`;
};

const SignUpPage = () => {
  const { setLoading } = useAuthStore();

  const navigation = useNavigation();
  const route = useRoute();

  const { name, rrn, phone } = route.params || {};

  //상태 변수
  const [form, setForm] = useState({
    name: name || '', // 이름
    rrn: rrn || '', //주민등록번호
    phone: phone || '', //전화번호
    email: '', // 이메일
    pw: '', // 비밀번호
    pwCheck: '', // 비밀번호 확인
  });

  const [error, setError] = useState({}); // 에러 메시지
  const [isPwValid, setIsPwValid] = useState(false); //비밀번호 유효성
  const [isPwMatch, setIsPwMatch] = useState(false); //비밀번호 일치성

  const showNormalAlert = useNormalAlertStore.getState().showNormalAlert;

  const navigateToLogin = () => {
    navigation.navigate('LoginPage');
  };

  //이메일 형식 검증 함수
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // 비밀번호 규칙 검사 (8자 이상, 영문/숫자/특수문자 포함)
  const isValidPassword = (pw) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/.test(pw);
  // 전화번호, 주민들록 번호 검사 추가 필요

  //공통 핸들러 - 입력값 변경을 처리
  const handleInputChange = (field, value) => {
    // field : 바꿀 필드의 이름 (ex. name), value : 입력된 새로운 값
    setForm((prev) => ({ ...prev, [field]: value })); //입력값을 form state에 저장 (기존 form 객체 복사 후, 해당 필드만 새 값으로 덮어씀)

    if (field === 'pw') {
      //비밀번호 필드가 변경되면
      setIsPwValid(isValidPassword(value)); //비밀번호 유효성 확인
      setIsPwMatch(form.pwCheck === value); //일치성 확인
      setError((prev) => ({ ...prev, pw: undefined, pwCheck: undefined }));
    } else if (field === 'pwCheck') {
      //비밀번호 확인 필드가 변경되면
      setIsPwMatch(form.pw === value); //일치성 확인
      setError((prev) => ({ ...prev, pwCheck: undefined }));
    } else if (error[field]) {
      //만약 error 메세지가 있다면
      setError((prev) => ({ ...prev, [field]: undefined })); //경고 이후 입력하면 error 사라지도록 함
    }
  };

  //회원 가입 버튼 핸들러
  const handleSignUp = async () => {
    setLoading(true); //로딩 켜기
    let newError = {};
    if (!form.email) newError.email = '이메일을 입력하세요';
    else if (!isValidEmail(form.email)) newError.email = '올바른 이메일 형식이 아닙니다';
    if (!form.pw) newError.pw = '비밀번호를 입력하세요';
    else if (!isValidPassword(form.pw))
      newError.pw = '비밀번호는 8자 이상, 영문/숫자/특수문자 포함!';
    if (!form.pwCheck) newError.pwCheck = '비밀번호 확인을 입력하세요';
    if (form.pw !== form.pwCheck) newError.pwCheck = '비밀번호가 다릅니다';

    //에러가 하나라도 있으면 함수 종료 => 회원가입 진행 안함
    setError(newError);
    if (Object.keys(newError).length > 0) {
      setLoading(false);
      return;
    }

    try {
      //회원가입 API 요청
      await createMemberInfo(form);
      showNormalAlert({
        title: '회원가입 완료',
        message: `회원가입이 완료되었습니다.\n로그인 후 이용해 주세요.`,
        onConfirmHandler: () => navigation.navigate('LoginPage'),
      });
    } catch (error) {
      const status = error.response.data.status;
      let message = `회원가입 중\n오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.`;
      if (status === 400) {
        message = `입력 정보 확인 후\n다시 가입해 주세요.`;
      } else if (status === 409) {
        message = `이미 가입된 계정입니다.`;
      }

      showNormalAlert({
        title: '회원가입 실패',
        message,
        showCancel: false,
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
        extraScrollHeight={70} // 키보드와 입력창 사이 간격
        enableOnAndroid={true} // 안드로이드 자동 스크롤 설정
      >
        <WaveHeader />
        <View style={styles.padding}>
          <Text style={styles.title}>회원가입</Text>
        </View>
        <NormalInput
          placeholder="이름"
          errorText={error.name}
          isEditable={false}
          value={form.name}
          inputWrpperWidth={{ width: '80%' }}
        />
        <NormalInput
          placeholder="생년월일"
          errorText={undefined}
          isEditable={false}
          value={getBirthDateFromRRN(form.rrn)} //주민등록번호에서 생년월일 변환
          inputWrpperWidth={{ width: '80%' }}
        />
        <NormalInput
          placeholder="전화번호"
          errorText={error.phone}
          isEditable={false}
          value={form.phone}
          inputWrpperWidth={{ width: '80%' }}
        />
        <NormalInput
          placeholder="이메일"
          errorText={error.email}
          isEditable={true}
          value={form.email}
          onChangeTextHandler={(text) => handleInputChange('email', text)}
          inputWrpperWidth={{ width: '80%' }}
        />
        <NormalInput
          placeholder="비밀번호"
          errorText={
            error.pw ||
            (form.pw && !isPwValid ? '비밀번호는 8자 이상, 영문/숫자/특수문자 포함!' : '')
          }
          isEditable={true}
          value={form.pw}
          onChangeTextHandler={(text) => handleInputChange('pw', text)}
          isSecureTextEntry={true}
          inputWrpperWidth={{ width: '80%' }}
        />
        <NormalInput
          placeholder="비밀번호 확인"
          errorText={error.pwCheck || (form.pwCheck && !isPwMatch ? '비밀번호가 다릅니다' : '')}
          isEditable={true}
          value={form.pwCheck}
          onChangeTextHandler={(text) => handleInputChange('pwCheck', text)}
          isSecureTextEntry={true}
          inputWrpperWidth={{ width: '80%' }}
        />
        <NormalButton title="회원가입" onPressHandler={handleSignUp} />
        <GrayButton title="로그인 하러 가기" onPressHandler={navigateToLogin} />
        <View style={styles.gongback}></View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default SignUpPage;
