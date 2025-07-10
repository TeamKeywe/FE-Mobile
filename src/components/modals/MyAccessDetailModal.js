import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './styles/MyAccessDetailModal.styles';
import { useAuthStore } from '../../stores/authStore';

// TODO: Pass-Service 구현 완료 시, 실제 데이터로 변경 필요
const MyAccessDetailModal = ({ isVisible, onClose, onConfirm, data }) => {
  const { setLoading } = useAuthStore();
  if (!data) return null;

  // visitorType에 따라 타이틀 결정
  const relationTitle =
    data.visitorType === '환자'
      ? '내 보호자'
      : data.visitorType === '보호자'
      ? '내 환자'
      : '상대방';

  // QR 버튼 노출 조건
  const isQrAvailable = (() => {
    if (data.issuanceStatus !== 'ISSUED') return false;
    const now = new Date();
    const start = new Date(data.startDate);
    const end = new Date(data.expireDate);
    return start <= now && now <= end;
  })();

  // QR 버튼 클릭 핸들러
  const handleQrPress = async () => {
    onClose();
    setTimeout(() => {
      onConfirm();
    }, 250);
  };

  let relationDetail = null;
  if (data.visitorType === '환자' && Array.isArray(data.guardians) && data.guardians.length > 0) {
    // 환자인 경우 보호자 목록 표시
    relationDetail = data.guardians.map((g, idx) => (
      <Text style={styles.modalText} key={idx}>{`${g.name}\t|\t${g.contact}`}</Text>
    ));
  } else if (data.visitorType === '보호자' && data.patientName) {
    // 보호자인 경우 환자 이름 표시
    relationDetail = <Text style={styles.modalText}>{data.patientName}</Text>;
  } else {
    relationDetail = <Text style={styles.modalText}>정보 없음</Text>;
  }

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.modalTitle}>{data.hospitalName}</Text>
          <Text style={styles.modalContentTitle}>{data.area}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.modalText}>방문자: {data.visitorType}</Text>
            <Text style={styles.modalText}>시작일: {data.startDate}</Text>
            <Text style={styles.modalText}>만료일: {data.expireDate}</Text>
            <Text style={styles.modalText}>승인 여부: {data.approval.replace(/\n/g, '')}</Text>
            <Text style={styles.modalText}>환자 번호: {data.patientNumber}</Text>
          </View>
          <View style={[styles.textContainer, { alignItems: 'center' }]}>
            <Text style={styles.modalContentTitle}>{relationTitle}</Text>
            {relationDetail}
          </View>
        </ScrollView>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.buttonText}>닫기</Text>
          </TouchableOpacity>
          {isQrAvailable && (
            <TouchableOpacity style={[styles.button, styles.QRButton]} onPress={handleQrPress}>
              <Text style={styles.buttonText}>QR</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default MyAccessDetailModal;
