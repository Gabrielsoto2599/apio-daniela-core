// ====================================================================
// VINCULAR.JS - REFACTURADO PARA RESALTADO DE SINTAXIS (SOTO SYSTEM)
// ====================================================================
import { useEffect } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function VincularDispositivoModal({ isOpen, onClose, onVinculacionExitosa }) {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (isOpen) {
      requestPermission();
    }
  }, [isOpen]);

  const handleBarCodeScanned = ({ data }) => {
    onVinculacionExitosa(data);
    onClose();
  };

  if (!permission || !permission.granted) return null;

  return (
    <Modal visible={isOpen} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />
        
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { position: 'absolute', top: 50, left: 20 },
  closeButton: { padding: 10 }
});
