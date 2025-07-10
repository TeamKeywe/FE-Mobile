import { View, Modal } from 'react-native';
import { styles } from './styles/LoadingOverlay.styles';
import KiwiSpinner from './KiwiSpinner';

const LoadingOverlay = ({ visible }) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={styles.overlay}>
      <KiwiSpinner />
    </View>
  </Modal>
);

export default LoadingOverlay;
