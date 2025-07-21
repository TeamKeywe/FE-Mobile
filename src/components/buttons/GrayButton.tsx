import { Text, TouchableOpacity, TextStyle, GestureResponderEvent } from 'react-native';
import { styles } from './styles/GrayButton.styles';

interface GrayButtonProps {
  title: string; 
  onPressHandler: (event: GestureResponderEvent) => void; 
  style?: TextStyle;
}

const GrayButton = ({
  title, // 버튼 텍스트
  onPressHandler, // 버튼 클릭 시 핸들러 함수
  style,
}: GrayButtonProps): JSX.Element => {
  return (
    <TouchableOpacity onPress={onPressHandler} style={styles.button}>
      <Text style={[styles.text, style]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default GrayButton;
