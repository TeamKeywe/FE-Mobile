import React from 'react';
import { View } from 'react-native';
import MenuList from '../components/lists/MenuList';

interface MenuItem {
  label: string;
  nextPage: string;
}

// 출입 권한 메뉴에 들어가는 항목과 연결된 페이지
const accessMenuList: MenuItem[] = [
  { label: '출입 권한 신청', nextPage: 'AccessRequestPage' },
  { label: '권한 목록 조회', nextPage: 'MyAccessListPage' },
];

const AccessListPage: React.FC = () => {
  return (
    <View>
      <MenuList items={accessMenuList} />
    </View>
  );
};

export default AccessListPage;
