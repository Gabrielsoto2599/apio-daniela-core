// ====================================================================
// VINCULAR.JS - CALIBRACIÓN DE ESCÁNER DE RED MULTIUSUARIO (SOTO SYSTEM 2026)
// Ubicación: app/home/vincular.js (Versión Blindada de Producción - Corregida)
// ====================================================================
import { useEffect, useRef } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function VincularDispositivoModal({ isOpen, onClose, onVinculacionExitosa, usuarioActual }) {
  const [permission, requestPermission] = useCameraPermissions();
  
  // 🛡️ CERROJO DE HARDWARE: Impide botes de memoria o dobles disparos en milisegundos
  const escaneoBloqueadoRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      escaneoBloqueadoRef.current = false; // Liberamos el gatillo al abrir el modal
      (async () => {
        try {
          await requestPermission();
        } catch (err) {
          console.warn("⚠️ [SOTO QR]: Error despertando hardware del lente:", err);
        }
      })();
    }
  }, [isOpen]);

  // 🚀 CONEXIÓN QUÍMICA ASÍNCRONA: Muerde la URL o el Token emitido por la computadora
  const handleBarCodeScanned = (objetoEscaner) => {
    // 🛡️ COMPRESIÓN DE ENTRADA: Garantiza extraer la clave 'data' sin importar el linter de Expo
    const data = objetoEscaner?.data;

    // Si el cerrojo está activo, ignoramos lecturas repetidas para proteger la red
    if (escaneoBloqueadoRef.current || !data) return;
    
    console.log("📡 [SOTO QR]: Captura de datos transaccionales en mostrador:", data);
    
    // 🚀 BLINDAJE DE COMPUERTA SOTO NET: 
    // Ahora valida tu URL de Railway, redes locales IP (192.168), localhost o tokens planos de sincronización
    if (data.includes('railway.app') || data.includes('192.168') || data.includes('localhost') || data.length > 5) {
      escaneoBloqueadoRef.current = true; // Echamos el pestillo de inmediato en la RAM

      // Sanitizamos el nombre del operador actual de la sección 'Mi Cuenta' para evitar espacios raros
      const operadorSaaS = usuarioActual ? encodeURIComponent(usuarioActual.trim()) : "Cajero_Anonimo";
      
      // Aseguramos que la URL conserve la barra de cierre obligatoria antes del parámetro
      // Esto evita que Django arroje un error de redirección 301 en la antena asíncrona
      let urlLimpia = data.trim();
      if (!urlLimpia.includes('?') && !urlLimpia.endsWith('/')) {
        urlLimpia += '/';
      } else if (urlLimpia.includes('?')) {
        const partes = urlLimpia.split('?');
        if (!partes[0].endsWith('/')) {
          partes[0] += '/';
        }
        urlLimpia = partes.join('?');
      }

      // Re-estructuramos la URL final inyectándole dinámicamente el usuario activo de la bodega
      const concatenador = urlLimpia.includes('?') ? '&' : '?';
      const urlConOperadorDinamico = `${urlLimpia}${concatenador}user_id=${operadorSaaS}`;
      
      console.log(`✅ [SOTO QR MATCH]: Enlazando sesión multiusuario para el operador: [${usuarioActual || 'Anónimo'}]`);
      
      onVinculacionExitosa(urlConOperadorDinamico); // Envía la URL amarrada con sesión y usuario a App.js
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
          // 🚀 ENLACE CORREGIDO: Pasa el evento directo para evitar desestructuraciones vacías en Android
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

        {/* Indicador inferior flotante del operador actual que escanea */}
        <View style={styles.operadorBadge}>
          <Text style={styles.operadorText}>📱 Operador: {usuarioActual || "No Identificado"}</Text>
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
  scannerHelperText: { color: '#e9edef', position: 'absolute', bottom: -40, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center', width: 300 },
  
  // Etiqueta de seguridad del operario en mostrador
  operadorBadge: { position: 'absolute', bottom: 60, backgroundColor: 'rgba(18, 27, 34, 0.85)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#334155' },
  operadorText: { color: '#22c55e', fontSize: 12, fontWeight: '700', fontFamily: 'System' }
});
