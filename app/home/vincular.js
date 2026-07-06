// ====================================================================
// VINCULAR.JS - CALIBRACIÓN DE ESCÁNER DE RED (SOTO SYSTEM 2026)
// Ubicación: app/home/vincular.js
// ====================================================================
import { useEffect } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function VincularDispositivoModal({ isOpen, onClose, onVinculacionExitosa }) {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (isOpen) {
      (async () => {
        try {
          await requestPermission();
        } catch (err) {
          console.warn("⚠️ [SOTO QR]: Error despertando hardware del lente:", err);
        }
      })();
    }
  }, [isOpen]);

  // 🚀 CONEXIÓN QUÍMICA ASÍNCRONA: Muerde la URL de Railway emitida por la computadora
  const handleBarCodeScanned = ({ data }) => {
    console.log("📡 [SOTO QR]: Captura de datos transaccionales en mostrador:", data);
    
    // Filtro de validación: Certifica que los bits traigan el ecosistema de Railway
    if (data && data.includes('railway.app')) {
      onVinculacionExitosa(data); // Dispara la prop maestra hacia App.js para mutar el backend
      onClose(); // Apaga la cámara nativa en la RAM de inmediato para liberar sensores
    } else {
      console.warn("⚠️ [SOTO QR]: Código QR inválido o ajeno al ecosistema de Apio SaaS.");
    }
  };

  if (!permission || !permission.granted) return null;

  return (
    <Modal visible={isOpen} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        
        {/* Lente nativo activo: Sincronizado en contraste con el monitor de la PC */}
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />
        
        {/* Guía visual en el aire para que el usuario centre el QR de tu Vite */}
        <View style={styles.scannerTargetBox}>
          <View style={styles.scannerCornerTopLeft} />
          <View style={styles.scannerCornerTopRight} />
          <View style={styles.scannerCornerBottomLeft} />
          <View style={styles.scannerCornerBottomRight} />
          <Text style={styles.scannerHelperText}>Apunte al QR de la Computadora</Text>
        </View>

        <View style={styles.overlay}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ====================================================================
// HOJA DE ESTILOS RÍGIDA DE HARDWARE
// ====================================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  overlay: { position: 'absolute', top: 50, left: 20 },
  closeButton: { padding: 10, backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: 25 },
  
  // Marco guía flotante del mostrador
  scannerTargetBox: { width: 220, height: 220, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  scannerCornerTopLeft: { position: 'absolute', top: 0, left: 0, width: 24, height: 24, borderColor: '#00a884', borderLeftWidth: 4, borderTopWidth: 4 },
  scannerCornerTopRight: { position: 'absolute', top: 0, right: 0, width: 24, height: 24, borderColor: '#00a884', borderRightWidth: 4, borderTopWidth: 4 },
  scannerCornerBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 24, height: 24, borderColor: '#00a884', borderLeftWidth: 4, borderBottomWidth: 4 },
  scannerCornerBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderColor: '#00a884', borderRightWidth: 4, borderBottomWidth: 4 },
  scannerHelperText: { color: '#e9edef', position: 'absolute', bottom: -40, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center', width: 300 }
});
