import React, { useState } from 'react';
import { 
  Text, 
  ScrollView, 
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles/NormalList.styles';

interface NormalListProps<T> {
  items?: T[]; 
  nextPage?: string;
  onItemPress?: (item: T, index: number) => void;
  renderItem?: (item: T, index: number, isSelected: boolean) => React.ReactNode;
  navigationParams?: (item: T) => Record<string, any>;
  style?: StyleProp<ViewStyle>;
}

const NormalList = <T extends unknown>({
  items = [], // props가 없거나 undefined일 때를 방지
  nextPage,
  onItemPress,
  renderItem,
  navigationParams, // 다음 페이지에 넘길 정보
  style, // 각 항목 style
}: NormalListProps<T>) => {
  // 선택 항목의 index 저장
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const navigation = useNavigation<any>();

  const handleSelect = (index: number) => {
    // 상태변수 변경
    setSelectedIndex(index);
    // onItemPress prop이 있으면 실행
    if (onItemPress) {
      onItemPress(items[index], index);
    }
    // nextPage prop이 있으면 해당 페이지로 이동
    if (nextPage) {
      // name: 병원명 혹은 메뉴명
      const params = navigationParams ? navigationParams(items[index]) : { name: items[index] };
      navigation.navigate(nextPage, params);
    }
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleSelect(index)}
          style={[styles.itemBox, style]}
        >
          {renderItem ? (
            renderItem(item, index, selectedIndex === index)
          ) : (
            <Text style={styles.itemText}>{String(item)}</Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default NormalList;
