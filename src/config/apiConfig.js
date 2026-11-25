// ====================================================================
// SOTO SYSTEM NETWORKING - ENRUTAMIENTO GLOBAL EN LA NUBE REAL (RENDER)
// Ubicación: src/config/apiConfig.js (Versión Blindada de Producción 2026)
// ====================================================================

// 🚀 RUTA MAESTRA CLOUD CONVENCIONAL (Para la API de Daniela IA en Render)
export const BASE_URL = 'https://apio-daniela-core-1.onrender.com';

// 📡 RUTA MAESTRA CLOUD EN TIEMPO REAL (Para conexiones WebSockets del canal QR)
// Convertimos automáticamente el protocolo seguro HTTPS de la nube al protocolo de Sockets WSS
export const WS_URL = BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://');

console.log("----------------------------------------------------------------");
console.log(`📡 [SOTO NET HTTP]: Tubería convencional unificada: ${BASE_URL}`);
console.log(`📡 [SOTO NET WSS]: Antena de tiempo real enlazada: ${WS_URL}`);
console.log("----------------------------------------------------------------");

