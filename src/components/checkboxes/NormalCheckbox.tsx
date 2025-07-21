import { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleProp,
  ViewStyle, 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './styles/NormalCheckbox.styles';

interface NormalCheckboxProps {
  labels: string[];
  onChangeHandler?: (selected: boolean[]) => void; 
  style?: StyleProp<ViewStyle>;
}

const NormalCheckbox = ({ labels, onChangeHandler, style 
}: NormalCheckboxProps): JSX.Element => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // 체크박스 토글 관리 함수
  const handleToggle = (index: number) => {
    const newIndex = selectedIndex === index ? null : index;
    setSelectedIndex(newIndex);

    // 부모 컴포넌트에 선택 상태 전달
    if (onChangeHandler) {
      // 선택된 항목만 true, 나머지는 false로 구성된 배열로 전달
      const result = labels.map((_, i) => i === newIndex);
      onChangeHandler(result);
    }
  };

  return (
    <ScrollView>
      {labels.map((label, index) => (
        <TouchableOpacity key={index} style={styles.container} onPress={() => handleToggle(index)}>
          <View style={[styles.checkbox, selectedIndex === index && styles.checked, style]}>
            {selectedIndex === index && <Ionicons name="checkmark" color="white" />}
          </View>
          <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default NormalCheckbox;
