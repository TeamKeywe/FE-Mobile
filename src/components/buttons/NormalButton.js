import { Text, TouchableOpacity } from 'react-native';
import { styles } from './styles/NormalButton.styles';

const NormalButton = ({
  title, // 버튼 텍스트
  onPressHandler, // 버튼 클릭 시 핸들러 함수
  length = 'long', // 버튼 길이
  isDisabled = false, // 버튼 클릭 비활성화 여부
  style, // 외부 스타일
}) => {
  return (
    <TouchableOpacity
      // disabled={isDisabled}
      onPress={onPressHandler}
      style={[length === 'long' ? styles.long : styles.short, isDisabled && styles.disabled, style]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default NormalButton;
