import { View, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles/WelcomePage.styles';
import NormalButton from '../components/buttons/NormalButton';

const WelcomePage = () => {
  const navigation = useNavigation();

  const navigateToLogin = () => {
    navigation.navigate('LoginPage');
  };

  const navigateToSignupVerification = () => {
    navigation.navigate('SignUpVerificationPage');
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logoTextImage}
        source={require('../assets/images/logoText.png')}
        resizeMode="contain" // 이미지 비율 유지
      />
      <Text style={styles.text}>당신의 출입 파트너, KeyWe</Text>
      <Image
        style={styles.logoIconImage}
        source={require('../assets/images/logoIcon.png')}
        resizeMode="contain" // 이미지 비율 유지
      />
      <View style={styles.buttonContainer}>
        <NormalButton title={'로그인'} length="short" onPressHandler={navigateToLogin} />
        <NormalButton
          title={'회원가입'}
          length="short"
          onPressHandler={navigateToSignupVerification}
        />
      </View>
    </View>
  );
};

export default WelcomePage;
