import { useRef, useState, useEffect } from 'react';
import { View, Dimensions, Animated } from 'react-native';
import { styles } from './styles/QrCards.styles';
import QrCard from './QrCard';
import DotPagination from './DotPagination';

// 화면의 가로 길이 가져오기
const { width } = Dimensions.get('window');
const CARD_WIDTH = width;
const OVERLAP_RATE = 0.3; // 카드가 겹치는 비율
const OVERLAP = CARD_WIDTH * OVERLAP_RATE; // 카드 간 겹치는 너비

const QrCards = ({ userVC, hasAccessAuthority, initialIndex = 0 }) => {
  const [pageIndex, setPageIndex] = useState(initialIndex);
  const flatListRef = useRef(null);

  const scrollX = useRef(new Animated.Value(initialIndex * (CARD_WIDTH - OVERLAP))).current;

  useEffect(() => {
    // 초기 인덱스가 바뀌거나, userVC 길이 변화시
    if (flatListRef.current && initialIndex >= 0 && initialIndex < userVC.length) {
      const offset = initialIndex * (CARD_WIDTH - OVERLAP);
      flatListRef.current.scrollToOffset({ offset, animated: true });
      setPageIndex(initialIndex);
    }
  }, [initialIndex, userVC.length]);

  // 권한 없거나 카드 데이터 없으면 안내 메시지 카드만
  if (!hasAccessAuthority || !userVC || userVC.length === 0) {
    return (
      <View style={{ flex: 0.8, width, alignItems: 'center' }}>
        <QrCard hasAccessAuthority={false} />
      </View>
    );
  }

  // 스크롤이 끝났을 때 현재 페이지 인덱스 계산
  const onMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / (CARD_WIDTH - OVERLAP));
    setPageIndex(newIndex);
  };

  // dot(인디케이터) 클릭 시 해당 카드로 이동
  const handleDotPress = (index) => {
    const offset = index * (CARD_WIDTH - OVERLAP);
    flatListRef.current?.scrollToOffset({ offset, animated: true });
    setPageIndex(index);
  };

  // 카드 리스트
  return (
    <View style={{ flex: 1, maxHeight: 650 }}>
      <Animated.FlatList
        removeClippedSubviews={false} // bare RN에서 렌더링 저하 해제
        ref={flatListRef}
        data={userVC}
        keyExtractor={(item) => item.did}
        horizontal //가로 스크롤
        showsHorizontalScrollIndicator={false} //하단 기본 스크롤바 숨김
        pagingEnabled={false} // snapToInterval을 사용하므로 false
        snapToInterval={CARD_WIDTH - OVERLAP} // 카드 단위로 스냅
        decelerationRate={0.95} // '0.9 ~ 1' 스크롤 감속 설정
        getItemLayout={(data, index) => ({
          length: CARD_WIDTH - OVERLAP,
          offset: (CARD_WIDTH - OVERLAP) * index,
          index,
        })}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: true,
          listener: (event) => {
            // 페이지 이동시 dot 인디케이터 업데이트 (자연스럽게 표시)
            const offsetX = event.nativeEvent.contentOffset.x;
            const index = Math.round(offsetX / (CARD_WIDTH - OVERLAP));
            if (index !== pageIndex) setPageIndex(index);
          },
        })}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 2) * (CARD_WIDTH - OVERLAP),
            (index - 1) * (CARD_WIDTH - OVERLAP),
            index * (CARD_WIDTH - OVERLAP),
            (index + 1) * (CARD_WIDTH - OVERLAP),
            (index + 2) * (CARD_WIDTH - OVERLAP),
          ];
          // 스크롤 위치에 따라 카드 크기 조정
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 0.8, 1, 0.8, 0.7],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              style={{
                width: CARD_WIDTH,
                marginLeft: index === 0 ? 0 : -OVERLAP, // 첫 카드는 겹치지 않게
                alignItems: 'center',
                zIndex: pageIndex === index ? 1 : 0, // 선택된 카드가 위로 오게
                height: '90%', // 카드 높이
                maxHeight: 480, // 카드 최대 높이
                transform: [{ scale }],
                marginTop: '9%',
              }}
            >
              <QrCard {...item} hasAccessAuthority={true} />
            </Animated.View>
          );
        }}
        onMomentumScrollEnd={onMomentumScrollEnd}
      />
      <View style={styles.dotContainer}>
        <DotPagination total={userVC.length} currentIndex={pageIndex} onPress={handleDotPress} />
      </View>
    </View>
  );
};

export default QrCards;
