// ====================================================================
// COMPILADOR DE VARIABLES DE ENTORNO SOTO SYSTEM
// Ubicación: babel.config.js
// ====================================================================
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 🚀 INYECCIÓN MAESTRA: Mapea tu archivo .env hacia el empaquetador de Expo
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
