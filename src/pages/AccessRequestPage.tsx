import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getHospitalList } from '../apis/AccessRequestApi';
import { useAuthStore } from '../stores/authStore';
import { useHospitalStore } from '../stores/hospitalStore';
import { styles } from './styles/AccessRequestPage.styles';
import NormalInput from '../components/textinputs/NormalInput';
import NormalList from '../components/lists/NormalList';

interface Hospital {
  hospitalId: number;
  hospitalName: string;
}

const AccessRequestPage: React.FC = () => {
  const { setLoading } = useAuthStore();
  const setHospitalList = useHospitalStore.getState().setHospitalList;
  const hospitalList = useHospitalStore.getState().hospitalList as Hospital[];

  const [searchText, setSearchText] = useState<string>('');
  const [hospitalName, setHospitalName] = useState<Hospital[]>([]);

  // 병원 목록 불러오기
  useEffect(() => {
    const getHospitalsName = async () => {
      setLoading(true);
      try {
        const data = await getHospitalList();
        setHospitalName(data);
        setHospitalList(data);
      } catch (error) {
        // 서버 오류 시, zustand 저장값 사용
        setHospitalName(hospitalList);
      } finally {
        setLoading(false);
      }
    };
    getHospitalsName();
  }, []);

  // 검색 결과 필터링
  const filteredHospitals = hospitalName.filter((hospital) =>
    hospital.hospitalName.includes(searchText),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>병원 선택</Text>
      <NormalInput
        placeholder="방문할 병원 이름을 입력하세요."
        value={searchText}
        onChangeTextHandler={setSearchText}
      />
      {filteredHospitals.length > 0 ? (
        <NormalList
          items={filteredHospitals}
          nextPage="AccessRequestRolePage"
          renderItem={(item: Hospital, index: number, isSelected: boolean) => (
            <Text style={styles.itemText}>{item.hospitalName}</Text>
          )}
          navigationParams={(item: Hospital) => ({
            hospitalId: item.hospitalId,
            hospitalName: item.hospitalName,
          })}
        />
      ) : (
        <Text style={styles.infoText}>검색 결과가 존재하지 않습니다.</Text>
      )}
    </View>
  );
};

export default AccessRequestPage;
