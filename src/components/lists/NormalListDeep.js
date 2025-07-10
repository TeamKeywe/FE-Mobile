import { ScrollView, View, Text, RefreshControl } from 'react-native';
import { styles } from './styles/NormalListDeep.styles'; //노말리스트와 같은 컴포넌트 스타일을 사용
import NormalList from './NormalList';

// TODO: Pass-Service 구현 완료 시, 실제 데이터로 변경 필요
//리스트안에 노말리스트가 있는 컴포넌트
const NormalListDeep = ({
  sections = [],
  onItemPress,
  renderItem,
  cardStyle,
  refreshing = false,
  onRefresh = () => {},
}) => {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {sections.map((section, idx) => (
        <View key={section.contentTitle || idx} style={styles.itemBox}>
          <Text style={styles.itemText}>{section.contentTitle}</Text>
          <NormalList
            items={section.accessList}
            renderItem={renderItem}
            style={cardStyle}
            //아이템 클릭 시 section 정보 함께 상위로 전달
            onItemPress={(item, index) => {
              if (onItemPress) onItemPress(section, item, index);
            }}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default NormalListDeep;
