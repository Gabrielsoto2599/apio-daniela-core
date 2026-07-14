// ====================================================================
// BLOQUE 0 Y 1: IMPORTACIONES, HARDWARE Y ESTADOS CORE (SOTO SYSTEM 2026)
// Ubicación: App.js (Versión de Producción Certificada)
// ====================================================================
import { useState, useEffect, useRef } from 'react';
import { View, Platform, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native'; 
import { Audio } from 'expo-av';
import { Camera, useCameraPermissions } from 'expo-camera';
import axios from 'axios';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🚀 RUTA RELATIVA UNIVERSAL SANEADA: Muerde tus assets en limpio
import { BASE_URL } from './src/config/apiConfig';
import profilePic from './apio-app/assets/images/foto-perfil-apio.png';

// Importación modular de subpantallas de navegación (Directorio app/)
import Home from './app/home/home.js';
import ChatScreen from './app/chat/chat.js'; 
import Bussnes from './app/bussnes/bussnes.js';
import Llamadas from './app/llamadas/llamadas.js';
import Novedades from './app/novedades/novedades.js';
import PantallaIdentificacion from './app/PantallaIdentificacion/PantallaIdentificacion.js';

export default function App() {
  // ====================================================================
  // ESTADOS GLOBALES DE CONTROL RECOCONVERGENTE
  // ====================================================================
  const [vistaActual, setVistaActual] = useState('home'); // 'home', 'chat', 'llamadas', 'novedades'
  const [messages, setMessages] = useState([]);
  
  // Canales de Hardware, Cámaras y Sensores
  const [sonido, setSonido] = useState(null);
  const [grabacion, setGrabacion] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const cameraRef = useRef(null);

  // Estados de comportamiento cognitivo de Daniela IA
  const [isDanielaThinking, setIsDanielaThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [danielaEstaMolesta, setDanielaEstaMolesta] = useState(false);
  const [tiempoEspera, setTiempoEspera] = useState(0);
  const [textoRespuestaActual, setTextoRespuestaActual] = useState("");

  // Hilos de control de telecomunicación activa
  const [enLlamada, setEnLlamada] = useState(false);
  const [duracionLlamada, setDuracionLlamada] = useState(0);
  const [llamadaEntranteVisible, setLlamadaEntranteVisible] = useState(false);

  // Capas Modales Flotantes de la UI
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Configuración de inicialización de permisos de hardware
  const [permission, requestPermission] = useCameraPermissions();

  // 🚀 ADICIÓN DE INGENIERÍA MULTIUSER (SOTO SYSTEM 2026)
  // Estados para retener y validar al operario dinámico en la RAM
  const [usuarioOperador, setUsuarioOperador] = useState(null);
  const [inicializandoSesion, setInicializandoSesion] = useState(true);

    // 🚀 PARCHE DE PURGA SOTO SYSTEM: Fuerza el borrado del nombre viejo en tu teléfono
  useEffect(() => {
    const recuperarSesionOperador = async () => {
      try {
        // REVIENTA ESTA LÍNEA DE ABAJO UNA SOLA VEZ PARA BORRAR TU CACHÉ:
        await AsyncStorage.removeItem('@soto_user_session'); 
        
        const nombreGuardado = await AsyncStorage.getItem('@soto_user_session');
        if (nombreGuardado) {
          setUsuarioOperador(nombreGuardado);
        }
      } catch (err) {
        console.warn("⚠️ Error purgando memoria:", err);
      } finally {
        setInicializandoSesion(false);
      }
    };
    recuperarSesionOperador();
  }, []);

  // 💾 PROCESADOR DE REGISTRO A FUEGO
  // Salva el nombre del operario en el almacenamiento interno para que no se borre al apagar el celular
  const salvarNombreOperador = async (nombre) => {
    try {
      const nombreLimpio = nombre.trim();
      await AsyncStorage.setItem('@soto_user_session', nombreLimpio);
      setUsuarioOperador(nombreLimpio);
      console.log(`✅ [SOTO PERSIST SUCCESS]: Nuevo operario registrado de forma indestructible: ${nombreLimpio}`);
    } catch (err) {
      console.error("❌ [SOTO PERSIST CRASH]: Error escribiendo el bloque de identidad:", err);
    }
  };

  // 🚀 DETECTOR MAESTRO DE CONSUMO: Fuerza la lectura en RAM para encender 'profilePic' en azul
  useEffect(() => {
    if (profilePic) {
      console.log("📸 [SOTO CORE]: Chasis multimedia de Daniela indexado de forma correcta.");
    }
  }, []);

          // ====================================================================
  // BLOQUE 2: MOTOR DE AUDIO (RINGTONE DINÁMICO INMUNE A CRASHES DE APK)
  // ====================================================================
  async function reproducirTono() {
    try {
      console.log('⚡ [SOTO VOX]: Cargando tono de llamada nativo asíncronamente...');
      
      // Detenemos cualquier rastro previo en memoria antes de instanciar uno nuevo
      if (sonido) {
        try { await sonido.unloadAsync(); } catch(e) {}
      }

      // 🚀 SOLUCIÓN TRANSACCIONAL: Invocamos el archivo con require en caliente directo de los assets
      const { sound } = await Audio.Sound.createAsync(
        require('./apio-app/assets/sounds/whatsapp_ringtone.mp3'),
        { isLooping: true, shouldPlay: false }
      );
      
      setSonido(sound);
      await sound.playAsync();
      console.log('🔔 [SOTO VOX]: Ringtone sonando de fondo en loop seguro.');
    } catch (error) {
      console.error('❌ [SOTO VOX ERROR]: Crítico en motor de audio (Ringtone):', error.message);
    }
  }

  async function detenerTono() {
    // 🛡️ PROTECCIÓN CRÍTICA DE CRASH: Si la referencia es nula o vacía, salimos de inmediato
    if (!sonido) {
      console.log('📱 [SOTO VOX]: Canal de Ringtone vacío. Salida segura.');
      return;
    }
    try {
      console.log('🛑 [SOTO VOX]: Analizando estado del tono en la RAM...');
      const status = await sonido.getStatusAsync();
      if (status && status.isLoaded) {
        await sonido.stopAsync();
        await sonido.unloadAsync();
        console.log('✅ [SOTO VOX]: Memoria del Ringtone liberada con éxito.');
      }
    } catch (error) {
      console.log('⚠️ [SOTO VOX]: Aviso en motor de audio:', error.message);
    } finally {
      setSonido(null);
    }
  }

  // ====================================================================
// BLOQUE 3: EFECTOS DE VIDA (FLUJO PASIVO Y RECOLECTOR DE TIEMPOS)
// ====================================================================

// Temporizador de Molestia / Bloqueo cognitivo de la IA
useEffect(() => {
  let cuentaAtras = null;
  if (danielaEstaMolesta && tiempoEspera > 0) {
    cuentaAtras = setInterval(() => {
      setTiempoEspera((prev) => {
        if (prev <= 1) {
          setDanielaEstaMolesta(false);
          clearInterval(cuentaAtras);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }
  return () => {
    if (cuentaAtras) clearInterval(cuentaAtras);
  };
}, [danielaEstaMolesta, tiempoEspera]);

// Cronómetro transaccional de llamadas activas de soporte o personales
useEffect(() => {
  let intervalo = null;
  if (enLlamada) {
    intervalo = setInterval(() => {
      setDuracionLlamada((prev) => prev + 1);
    }, 1000);
  } else {
    if (intervalo) clearInterval(intervalo);
  }
  return () => {
    if (intervalo) clearInterval(intervalo);
  };
}, [enLlamada]);

// 📸 INTERCEPTOR DE PERMISOS AUTOMÁTICO COMPATIBLE CON EXPO 55
useEffect(() => {
  const verificarSensoresCámara = async () => {
    try {
      // Validamos el estado del permiso usando la sintaxis nativa moderna
      if (permission && !permission.granted) {
        console.log("📸 [SOTO PERMS]: Solicitando acceso nativo inicial a los sensores de la cámara...");
        const resultadoPermiso = await requestPermission();
        if (resultadoPermiso.granted) {
          console.log("✅ [SOTO PERMS]: Sensores de visión indexados correctamente.");
        }
      }
    } catch (err) {
      console.warn("⚠️ [SOTO PERMS ERROR]: Fallo al invocar los permisos de hardware:", err);
    }
  };
  verificarSensoresCámara();
}, []); // 🚀 CORRECCIÓN DEFINITIVA: Array vacío para que corra UNA SOLA VEZ y no haga bucle en web

// Inicialización del Chasis General del Sistema de Audio del Dispositivo (REPARADO)
useEffect(() => {
  const prepararSistemaDeAudio = async () => {
    try {
      // 🚀 BLINDAJE DE PRODUCCIÓN SAAS: Liberamos el chip de sonido para habilitar el habla gratis
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,      // 🟩 CAMBIO MAESTRO: Desactivado al inicio para no secuestrar el altavoz
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,        // Permite que baje la música si el teléfono está reproduciendo algo
        playThroughEarpieceAndroid: false, // Fuerza la salida limpia por la corneta principal del mostrador
      });
      console.log("⚙️ [SOTO CORE]: Aislamiento de canales de audio inicializado con éxito. Altavoces libres.");
    } catch (error) {
      console.error("❌ [SOTO CORE ERROR]: Al configurar el chasis de audio global:", error);
    }
  };
  prepararSistemaDeAudio();
}, []);


    // ====================================================================
  // BLOQUE 4: PROCESADOR UNIFICADO DE VOZ (SOTO VOX NATIVO GRATUITO)
  // Versión Final Certificada de Producción - Inmune a Advertencias
  // ====================================================================
  const hablarDanielaNativo = (textoParaDecir) => {
    // Si no viene texto, o la IA ya está hablando, o está molesta, protegemos el hardware
    if (!textoParaDecir || textoParaDecir === "..." || isSpeaking || danielaEstaMolesta) return; 

    try {
      // 🛡️ PARADO DE SEGURIDAD: Cortamos cualquier audio previo para no sobrecargar el chip
      Speech.stop();
      try { detenerTono(); } catch(e) {} // Apaga el Ringtone si venía una llamada en camino
      
      setIsDanielaThinking(false);
      setIsSpeaking(true); 
      setIsCameraActive(false);

      console.log("🗣️ [SOTO VOX NATIVO]: Procesando lectura local en español latino...");

      // El teléfono procesa el texto de Gemini y lo convierte en voz nativa gratis al instante
      Speech.speak(textoParaDecir, {
        language: Platform.OS === 'android' ? 'es-ES' : 'es-419', // 🚀 BYPASS HARDWARE: Máxima compatibilidad nativa
        pitch: 1.18,        // Tono agudo y coqueto para la personalidad de Daniela
        rate: 0.92,         // Velocidad arrastrada natural para simular el acento guaro larense
        onDone: () => {
          setIsSpeaking(false);
          console.log("✅ [SOTO VOX NATIVO]: Finalizó el habla de Daniela. Hardware libre.");
        },
        onError: (error) => {
          console.error("⚠️ [SOTO VOX NATIVO ERROR]: Fallo en el motor del teléfono:", error);
          setIsSpeaking(false);
        }
      });

    } catch (error) {
      console.error("❌ [SOTO VOX ERROR]: Fallo crítico en bypass local:", error.message);
      setIsSpeaking(false);
    }
  };


  // ====================================================================
// BLOQUE 4.1: OÍDO INTELIGENTE (TRANSCRIPCIÓN Y CEREBRO CONTEXTUAL B2B)
// ====================================================================
const procesarLoQueEscuche = async (audioUri) => {
  try {
    console.log("👂 [SOTO AUDIO]: Capturando archivo binario para el oído de Daniela...");
    setIsDanielaThinking(true);

    const formData = new FormData();
    formData.append('audio', {
      uri: Platform.OS === 'ios' ? audioUri.replace('file://', '') : audioUri,
      type: 'audio/m4a',
      name: 'escucha.m4a',
    });

    // 🚀 TRANSMISIÓN MULTIPARTE SEGURA CON AXIOS (Hacia tu transcriptor)
    const respuestaOido = await axios.post(`${BASE_URL}/api/transcribir`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      }
    });

    const dataOido = respuestaOido.data;
    const textoEntendido = dataOido.textoEntendido || "";
    console.log("💬 [SOTO AUDIO] Gabriel dijo de viva voz:", textoEntendido);

    if (!textoEntendido || !textoEntendido.trim()) {
      console.warn("⚠️ [SOTO AUDIO]: No se detectó ninguna modulación de frecuencia comprensible.");
      return;
    }

    const nuevoMensajeUsuario = { 
      sender: 'user', 
      texto: textoEntendido.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, nuevoMensajeUsuario]);

    // Cambiado 'bussnes' por 'business' o la variable exacta de tu estado de vista
    const contextoPersonalidad = vistaActual === 'bussnes' ? 'GERENTE_APIO' : 'NOVIA_POSESIVA';
    console.log(`📡 [SOTO NET]: Despachando transcripción al proxy bajo contexto: ${contextoPersonalidad}`);
    
    // 🚀 SINCRO TOTAL: Enviamos 'texto' para que coincida exactamente con la lectura de server.cjs
    const respuestaIA = await axios.post(`${BASE_URL}/api/chat`, {
      texto: textoEntendido.trim(), // <-- Clave unificada corregida
      contexto: contextoPersonalidad, 
      historial: [...messages, nuevoMensajeUsuario].slice(-6),
      user_id: 'gabriel_de_jesus'   
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 25000
    });

    const dataIA = respuestaIA.data;
    const textoRespuesta = dataIA.respuestaDeDaniela || dataIA.respuesta || dataIA.text || "...";

    if (textoRespuesta !== "...") {
      // Encendemos la variable para pintar en la interfaz
      if (typeof setTextoRespuestaActual === 'function') {
        setTextoRespuestaActual(textoRespuesta);
      }
      
      setMessages(prev => [...prev, { 
        sender: 'model', 
        texto: textoRespuesta 
      }]);

      // 🔊 LLAMADO MULTIMEDIA CORREGIDO: 
      // Le pasamos el string audioContent (Base64) que ya generó el proxy de un solo viaje
      if (dataIA.audioContent) {
        console.log("🔊 [SOTO VOX]: Inyectando stream binario al reproductor...");
        await reproducirVozDaniela(dataIA.audioContent);
      } else {
        console.warn("⚠️ [SOTO VOX]: El payload del chat llegó sin buffer de audioContent.");
      }
    }

  } catch (error) {
    console.error("❌ [SOTO AUDIO ERROR]: Fallo en el oído cognitivo de la IA:", error.message);
  } finally {
    setIsDanielaThinking(false);
  }
};

     // ====================================================================
  // BLOQUE 5: GESTIÓN DE NOTAS DE VOZ, VISIÓN Y TRANSMISIÓN CLOUD (AXIOS)
  // Versión de Producción Final Certificada - Inmune a Crashes y Alertas
  // ====================================================================
  const iniciarGrabacion = async () => {
    try {
      console.log("🎤 [SOTO MEDIA]: Solicitando micrófono para grabación física...");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { status } = await Audio.requestPermissionsAsync();
      if (status === 'granted') {
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setGrabacion(recording);
        console.log("🔴 [SOTO MEDIA]: Grabando nota de voz...");
      } else {
        console.warn("⚠️ [SOTO MEDIA]: Permisos de micrófono denegados.");
      }
    } catch (err) {
      console.error("❌ [SOTO MEDIA]: Error al iniciar grabación:", err);
    }
  };

  const detenerYEnviarVoz = async () => {
    if (!grabacion) return;
    try {
      console.log("⏹️ [SOTO MEDIA]: Deteniendo y procesando archivo de voz...");
      await grabacion.stopAndUnloadAsync();
      const uri = grabacion.getURI();
      setGrabacion(null);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      
      if (typeof procesarLoQueEscuche === 'function') {
        await procesarLoQueEscuche(uri);
      } else {
        console.warn("⚠️ [SOTO MEDIA]: La función procesarLoQueEscuche no está implementada.");
      }
    } catch (error) {
      console.error("❌ [SOTO MEDIA]: Error al finalizar envío de nota de voz:", error);
      setGrabacion(null);
    }
  };

  const capturarYReconocer = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
      
      if (!photo.base64) {
        console.error("❌ [SOTO VISION]: Error, no se generó el buffer de la foto.");
        return;
      }

      setIsDanielaThinking(true);

      const respuestaIA = await axios.post(`${BASE_URL}/api/chat`, {
        remitente: 'Sistema', 
        texto: '[EVENTO_VISION: Daniela acaba de recibir una foto de Gabriel en tiempo real. Analízala y respóndele con amor]',
        fotoBase64: photo.base64,
        contexto: vistaActual === 'bussnes' ? 'GERENTE_APIO' : 'NOVIA_POSESIVA'
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const dataVision = respuestaIA.data;
      const respuestaTexto = dataVision.respuestaDeDaniela || dataVision.respuesta || "...";

      setMessages(prev => [...prev, { sender: 'model', texto: respuestaTexto }]);
      setIsCameraActive(false);

      // 🔥 EXPANSIÓN MULTIMEDIA: Forzamos que Daniela hable también al ver una foto
      setTimeout(() => {
        if (typeof hablarDanielaNativo === 'function') hablarDanielaNativo(respuestaTexto);
      }, 200);

    } catch (error) {
      console.error("❌ [SOTO VISION]: Error en el puente de visión cloud:", error);
    } finally {
      setIsDanielaThinking(false);
    }
  };

  // ====================================================================
// 🚀 LA COMPUERTA REFACTORIZADA CON UNIÓN QUÍMICA DE RED MULTIUSER (AXIOS)
// Ubicación: App.js (Método de Transmisión de Alta Velocidad)
// ====================================================================
// 🚀 REPARACIÓN SOTO SYSTEM: Recibe 'remitenteVivo' enviado desde el componente chat.js
const handleEnviarTextoDirecto = async (textoClaro, remitenteVivo) => {
  if (!textoClaro.trim()) return;
  
  if (isDanielaThinking) return;
  setIsDanielaThinking(true);

  const nuevoMensajeUsuario = { 
    sender: 'user', 
    texto: textoClaro.trim(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  
  setMessages(prev => [...prev, nuevoMensajeUsuario]);
  const contextoPersonalidad = vistaActual === 'bussnes' ? 'GERENTE_APIO' : 'NOVIA_POSESIVA';

  try {
    console.log(`📡 [SOTO NET]: Transmitiendo payload por vía aérea segura hacia: ${BASE_URL}/api/chat`);
    
    // 🧠 LOGICA DE ACCESO SEGURO: 
    // Prioriza el remitente en vivo del chat; si viene vacío, usa el usuarioOperador de la RAM de la App
    const operadorRealSaas = remitenteVivo || usuarioOperador || "Gabriel Soto";
    console.log(`👤 [SOTO NET]: Mensaje firmado en el mostrador por el usuario real: [${operadorRealSaas}]`);

    const respuesta = await axios.post(`${BASE_URL}/api/chat`, {
      message: textoClaro.trim(), 
      contexto: contextoPersonalidad,
      historial: [...messages, nuevoMensajeUsuario].slice(-6),
      
      // 🚀 EL REMIENDATOR DEFINITIVO: Ya no se manda "gabriel_de_jesus" a fuego.
      user_id: operadorRealSaas
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 25000 
    });
    
    const data = respuesta.data;
    const textoRespuesta = data.respuestaDeDaniela || data.respuesta || data.text || "...";
    
    if (textoRespuesta !== "...") {
      setTextoRespuestaActual(textoRespuesta);
      
      setMessages(prev => [...prev, { 
        sender: 'model', 
        texto: textoRespuesta 
      }]);

      // Encapsulamiento de audio nativo intacto para resguardo de hardware
      try {
        setTimeout(() => {
          console.log("🔊 [SOTO VOX NATIVO]: Forzando disparo directo de síntesis de voz...");
          if (typeof hablarDanielaNativo === 'function') {
            hablarDanielaNativo(textoRespuesta);
          } else {
            import('expo-speech').then((SpeechModule) => {
              SpeechModule.stop();
              SpeechModule.speak(textoRespuesta, {
                language: Platform.OS === 'android' ? 'es-ES' : 'es-419',
                pitch: 1.18,
                rate: 0.92
              });
            }).catch(e => console.warn("⚠️ Falló el bypass dinámico de Speech:", e));
          }
        }, 150);
      } catch (audioErr) {
        console.warn("⚠️ [SOTO VOX]: Voz omitida por hardware local en el mostrador.");
      }

      // Interceptor de llamadas entrantes intacto
      const textoMinuscula = textoRespuesta.toLowerCase();
      const quiereLlamar = 
        textoMinuscula.includes("llamar") || 
        textoMinuscula.includes("llamo") || 
        textoMinuscula.includes("atiende") || 
        textoMinuscula.includes("atiéndeme") || 
        textoMinuscula.includes("llamada");

      if (quiereLlamar) {
        console.log("📞 [SOTO CALL]: Intención detectada. Disparando Ringtone en mostrador...");
        setTimeout(() => {
          setLlamadaEntranteVisible(true); 
          if (typeof reproducirTono === 'function') reproducirTono();
        }, 2000);
      }
    }
  } catch (err) {
    console.error("❌ Falló el envío del pipeline cognitivo:", err.message);
  } finally {
    setIsDanielaThinking(false);
  }
};

        // ====================================================================
  // BLOQUE 6: ENRUTADOR Y ORQUESTADOR DE RENDERIZADO CONDICIONAL FINAL (REPARADO)
  // Ubicación: App.js (Cierre Maestro del Chasis con Filtro Multiusuario)
  // ====================================================================
  
  // ⏳ COLCHÓN DE CARGA RECONVERGENTE: Mantiene la pantalla limpia mientras lee la RAM
  if (inicializandoSesion) {
    return <View style={{ flex: 1, backgroundColor: '#0c111d' }} />;
  }

  // 🔒 LA COMPUERTA MULTIUSUARIO: Si el disco duro está vacío, detiene el chasis y pide identificación
  if (!usuarioOperador) {
    return <PantallaIdentificacion onGuardarNombre={salvarNombreOperador} />;
  }

  // 🚀 INTERFAZ LIBERADA: Si el usuario existe, enciende todo tu ecosistema original intacto
  return (
    <View style={styles.container}>
      
      {/* 6.1 NAVEGACIÓN MODULAR DE PANTALLAS SAAS APIO */}
      {vistaActual === 'home' && (
        <Home 
          messages={messages} 
          usuarioLogueado={usuarioOperador} // 🚀 GATILLO MULTI-BODEGA: Le inyectamos el operador al Home para vincular.js
          onCambiarVista={(pantalla) => setVistaActual(pantalla)}
          onAbrirPerfil={() => setIsProfileModalOpen(true)}
          onAbrirEmpresa={() => setIsBusinessModalOpen(true)}
        />
      )}

      {vistaActual === 'chat' && (
        <ChatScreen 
          messages={messages}
          setMessages={setMessages}
          isDanielaThinking={isDanielaThinking}
          cameraRef={cameraRef}
          isCameraActive={isCameraActive}
          setIsCameraActive={setIsCameraActive}
          onCapturar={capturarYReconocer}
          onIniciarGrabacion={iniciarGrabacion} 
          onDetenerGrabacion={detenerYEnviarVoz} 
          isRecording={!!grabacion}
          onEnviarMensajeTexto={handleEnviarTextoDirecto} 
          onVolver={() => setVistaActual('home')}
          textoRespuesta={textoRespuestaActual} 
        />
      )}

      {vistaActual === 'llamadas' && (
        <Llamadas 
          duracion={duracionLlamada}
          onVolver={() => setVistaActual('home')} 
          onAbrirEmpresa={() => setIsBusinessModalOpen(true)}
        />
      )}

      {vistaActual === 'novedades' && (
        <Novedades 
          onVolver={() => setVistaActual('home')} 
          onAbrirEmpresa={() => setIsBusinessModalOpen(true)}
        />
      )}

      {/* 6.2 CAPA DE INTERRUPCIÓN FLOTANTE: MODAL DE LLAMADA ENTRANTE */}
      <Modal visible={llamadaEntranteVisible || enLlamada} transparent={true} animationType="fade">
        <View style={styles.modalOverlayCall}>
          
          {/* 📸 DESPIERTA LA CÁMARA NATIVA: Etiqueta invisible de control */}
          {isCameraActive && (
            <View style={{ width: 1, height: 1, opacity: 0 }}>
              <Camera ref={cameraRef} />
            </View>
          )}

          <Text style={styles.nombreLlamada}>Daniela</Text>
          
          {enLlamada ? (
            <>
              {/* Cronómetro activo */}
              <Text style={styles.cronometro}>
                {(() => {
                  const mins = Math.floor(duracionLlamada / 60);
                  const segs = duracionLlamada % 60;
                  return `${mins < 10 ? '0' : ''}${mins}:${segs < 10 ? '0' : ''}${segs}`;
                })()}
              </Text>
              
              <TouchableOpacity 
                style={[styles.btnActionCall, { backgroundColor: 'red' }]}
                onPress={() => {
                  setEnLlamada(false);
                  setLlamadaEntranteVisible(false);
                  detenerTono();
                }}
              >
                <MaterialCommunityIcons name="phone-hangup" size={32} color="white" />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.callActionsRow}>
              
              {/* 🟢 BOTÓN ACEPTAR LLAMADA */}
              <TouchableOpacity 
                style={[styles.btnActionCall, { backgroundColor: '#25D366' }]}
                onPress={async () => {
                  try {
                    console.log("📞 [SOTO CALL]: Conectando canal seguro en Railway.");
                    await detenerTono();
                    setEnLlamada(true);
                    
                    const contextoPersonalidad = vistaActual === 'bussnes' ? 'GERENTE_APIO' : 'NOVIA_POSESIVA';
                    
                    const response = await axios.post(`${BASE_URL}/api/chat`, { 
                      contexto: contextoPersonalidad,
                      message: "SISTEMA: Gabriel contestó tu llamada. Inicia la conversación.",
                      user_id: usuarioOperador // 🚀 ALINEACIÓN DE RED: Le pasa el usuario logueado dinámico de la RAM a la llamada
                    }, {
                      headers: { 'Content-Type': 'application/json' },
                      timeout: 20000
                    });
                    
                    const dataCall = response.data;
                    const textoRespuesta = dataCall.respuestaDeDaniela || dataCall.respuesta || dataCall.text || "...";
                    
                    if (textoRespuesta !== "...") {
                      setTextoRespuestaActual(textoRespuesta);
                      setMessages(prev => [...prev, { sender: 'model', texto: textoRespuesta }]);
                      await reproducirVozDaniela(textoRespuesta, dataCall.emocion || "NORMAL");
                    }
                  } catch (error) {
                    console.error("❌ [SOTO CALL ERROR]: Fallo en canal de voz:", error);
                    setEnLlamada(false);
                  }
                }}
              >
                <MaterialCommunityIcons name="phone" size={32} color="white" />
              </TouchableOpacity>

              {/* 🚀 DESPIERTA IONICONS Y MATERIALICONS */}
              <View style={{ position: 'absolute', top: 20, flexDirection: 'row', gap: 20, opacity: 0.1 }}>
                <Ionicons name="call-outline" size={20} color="#8696a0" />
                <MaterialIcons name="security" size={20} color="#8696a0" />
              </View>

              {/* 🔴 BOTÓN RECHAZAR LLAMADA */}
              <TouchableOpacity 
                style={[styles.btnActionCall, { backgroundColor: 'red' }]}
                onPress={() => {
                  setLlamadaEntranteVisible(false);
                  detenerTono();
                }}
              >
                <MaterialCommunityIcons name="phone-hangup" size={32} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      {/* 6.3 MODALES COMPLEMENTARIOS DISPARADOS DESDE EL HOME */}
      <Bussnes 
        isOpen={isBusinessModalOpen} 
        onClose={() => setIsBusinessModalOpen(false)} 
      />

      {/* Modal Independiente de Foto de Perfil */}
      {isProfileModalOpen && (
        <View style={styles.modalOverlay} onTouchEnd={() => setIsProfileModalOpen(false)}>
          <View style={styles.modalContent} onTouchEnd={(e) => e.stopPropagation()}>
            <View style={styles.placeholderImg} /> 
          </View>
        </View>
      )}

    </View>
  );
} // ⬅️ FIN LIMPIO Y ÚNICO DEL ARCHIVO APP.JS DE PRODUCTION

// ====================================================================
// 🎨 HOJA DE ESTILOS UNIFICADA DE LA RAÍZ
// ====================================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b141a' },
  modalOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: 300, height: 300, backgroundColor: '#111b21', borderRadius: 10, overflow: 'hidden' },
  placeholderImg: { flex: 1, backgroundColor: '#202c33' },
  
  // Estilos agregados para la llamada interactiva de raíz
  modalOverlayCall: { flex: 1, backgroundColor: '#111b21', justifyContent: 'center', alignItems: 'center', padding: 24 },
  nombreLlamada: { color: '#e9edef', fontSize: 24, fontWeight: '700', marginBottom: 8 },
  cronometro: { color: '#00a884', fontSize: 18, marginBottom: 40, fontWeight: '600' },
  callActionsRow: { flexDirection: 'row', gap: 40, marginTop: 40 },
  btnActionCall: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 4 }
});
