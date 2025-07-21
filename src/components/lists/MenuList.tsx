import React, { useState } from 'react';
import { 
  Text, 
  ScrollView, 
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles/NormalList.styles'; //노말리스트와 같은 컴포넌트 스타일을 사용

interface MenuItem {
  label: string;
  nextPage?: string;
}

interface MenuListProps {
  items: MenuItem[];
  style?: StyleProp<ViewStyle>;
}

const MenuList: React.FC<MenuListProps> = ({ items, style }) => {
  // 선택 항목의 index 저장
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const navigation = useNavigation<any>();

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    const { nextPage, label } = items[index];
    if (nextPage) {
      navigation.navigate(nextPage, { name: label });
    }
  };

  return (
    <ScrollView 
      style={styles.scrollView} 
      contentContainerStyle={styles.contentContainer}
    >
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleSelect(index)}
          style={[styles.itemBox, style]}
        >
          <Text style={[styles.itemText]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default MenuList;
