// ====================================================================
// SOTO SYSTEM NETWORKING - ENRUTAMIENTO INTELIGENTE POR WI-FI REAL
// Ubicación: src/config/apiConfig.js
// ====================================================================
import { Platform } from 'react-native';

export const BASE_URL =
  Platform.OS === 'web'
    ? 'http://127.0.0.1:3001'
    : 'http://192.168.0.125:3001'; // 🚀 TU IP REAL DE IPCONFIG REPARADA

console.log(`📡 [SOTO NET]: Interfaz móvil enrutada hacia: ${BASE_URL}`);
