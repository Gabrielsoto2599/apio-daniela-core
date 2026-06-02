import { Platform } from 'react-native';

// Si tu PC cambia de IP, solo cambias este valor aquí
const PC_IP = '192.168.1.119'; 
const PORT = '3001';

export const BASE_URL = Platform.select({
  web: 'http://127.0.0.1:' + PORT,
  default: `http://${PC_IP}:${PORT}`, // Esto cubre Android e iOS
});