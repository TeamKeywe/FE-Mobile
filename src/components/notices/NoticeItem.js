import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { styles } from './styles/NoticeItem.styles';

const ALERT_TYPE_INFO = {
  APPROVE: {
    icon: 'checkmark-circle',
    iconColor: colors.primary,
    title: '보호자 출입 신청 승인',
  },
  REJECT: {
    icon: 'ban-sharp',
    iconColor: 'darkred',
    title: '보호자 출입 신청 거절',
  },
  APPLY: {
    icon: 'paper-plane',
    iconColor: 'black',
    title: '보호자 출입 신청',
  },
};

export default function NoticeItem({ type, time, message }) {
  const info = ALERT_TYPE_INFO[type] || ALERT_TYPE_INFO.APPLY;
  return (
    <View style={styles.box}>
      <View style={styles.contentHeader}>
        <View style={styles.titleContainer}>
          <Ionicons name={info.icon} size={20} color={info.iconColor} style={styles.iconStyle} />
          <Text style={styles.text}>{info.title}</Text>
        </View>
        <Text style={styles.text}>{time}</Text>
      </View>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
