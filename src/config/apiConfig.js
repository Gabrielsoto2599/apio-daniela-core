// ====================================================================
// SOTO SYSTEM NETWORKING - ENRUTAMIENTO GLOBAL EN LA NUBE REAL (RAILWAY)
// Ubicación: src/config/apiConfig.js (Versión Blindada de Producción)
// ====================================================================

// 🚀 RUTA MAESTRA CLOUD CONVENCIONAL (Para peticiones HTTP de la API de Chat)
export const BASE_URL = 'https://web-production-dcec7.up.railway.app';

// 📡 RUTA MAESTRA CLOUD EN TIEMPO REAL (Para conexiones WebSockets del canal QR con Django Channels)
// Convertimos automáticamente el protocolo seguro HTTPS de la nube al protocolo de Sockets WSS de Daphne
export const WS_URL = BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://');

console.log("----------------------------------------------------------------");
console.log(`📡 [SOTO NET HTTP]: Tubería convencional unificada: ${BASE_URL}`);
console.log(`📡 [SOTO NET WSS]: Antena de tiempo real enlazada: ${WS_URL}`);
console.log("----------------------------------------------------------------");
