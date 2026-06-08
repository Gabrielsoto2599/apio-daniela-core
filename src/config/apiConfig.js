import { Platform } from 'react-native';

// Cambia esta IP por la IP local real de tu computadora (la que tenías antes)
const PC_IP = '192.168.1.119'; 
const PORT = '3001';

export const BASE_URL = Platform.select({
  web: 'http://localhost:' + PORT,
  android: 'http://10.0.2.2:' + PORT, // Ideal para el emulador de Android Studio
  default: `http://${PC_IP}:${PORT}`,   // Ideal para el teléfono físico por Wi-Fi o iOS
});
