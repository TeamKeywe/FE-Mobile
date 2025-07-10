import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import NoticeItem from './NoticeItem';
import { styles } from './styles/NoticeList.styles';

export default function NoticeList({ data, refreshControl }) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>알림이 없습니다.</Text>
      </View>
    );
  }

  // 날짜별로 그룹핑
  const grouped = data.reduce((acc, item) => {
    acc[item.date] = acc[item.date] || [];
    acc[item.date].push(item);
    return acc;
  }, {});

  // 날짜 역순 정렬
  const sortedDates = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1));

  return (
    <ScrollView style={styles.container} refreshControl={refreshControl}>
      {sortedDates.map((date) => (
        <View key={date}>
          <Text style={styles.dateText}>{date}</Text>
          {grouped[date]
            .slice()
            .reverse()
            .map((alert) => (
              <NoticeItem
                key={alert.id}
                type={alert.type}
                time={alert.time}
                message={alert.message}
              />
            ))}
        </View>
      ))}
    </ScrollView>
  );
}
