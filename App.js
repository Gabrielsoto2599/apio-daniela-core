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

// 🚀 RUTA RELATIVA UNIVERSAL SANEADA: Muerde tus assets en limpio
import { BASE_URL } from './src/config/apiConfig';
import profilePic from './apio-app/assets/images/foto-perfil-apio.png';

// Importación modular de subpantallas de navegación (Directorio app/)
import Home from './app/home/home.js';
import ChatScreen from './app/chat/chat.js'; 
import Bussnes from './app/bussnes/bussnes.js';
import Llamadas from './app/llamadas/llamadas.js';
import Novedades from './app/novedades/novedades.js';

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

  // 🚀 DETECTOR MAESTRO DE CONSUMO: Fuerza la lectura en RAM para encender 'profilePic' en azul
  useEffect(() => {
    if (profilePic) {
      console.log("📸 [SOTO CORE]: Chasis multimedia de Daniela indexado de forma correcta.");
    }
  }, []);

      // ====================================================================
  // BLOQUE 2: MOTOR DE AUDIO (RINGTONE UNIFICADO COMPATIBLE DE RED)
  // ====================================================================
  async function reproducirTono() {
    try {
      console.log('⚡ [SOTO VOX]: Cargando tono de llamada nativo...');
      
      // 🚀 RUTA SINCRONIZADA: Formato limpio directo de tus assets locales
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/sounds/whatsapp_ringtone.mp3'),
        { isLooping: true }
      );
      setSonido(sound);
      await sound.playAsync();
      console.log('🔔 [SOTO VOX]: Ringtone sonando de fondo en loop.');
    } catch (error) {
      console.error('❌ [SOTO VOX ERROR]: Crítico en motor de audio (Ringtone):', error);
    }
  }

  async function detenerTono() {
    if (sonido) {
      try {
        console.log('🛑 [SOTO VOX]: Deteniendo tono de forma segura...');
        const status = await sonido.getStatusAsync();
        if (status.isLoaded) {
          await sonido.stopAsync();
          await sonido.unloadAsync();
          console.log('✅ [SOTO VOX]: Memoria del Ringtone liberada con éxito.');
        }
      } catch (error) {
        console.log('⚠️ [SOTO VOX]: Aviso en motor de audio (Tono ya liberado):', error);
      } finally {
        setSonido(null);
      }
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
    return () => clearInterval(cuentaAtras);
  }, [danielaEstaMolesta, tiempoEspera]);

  // Cronómetro transaccional de llamadas activas de soporte o personales
  useEffect(() => {
    let intervalo = null;
    if (enLlamada) {
      intervalo = setInterval(() => {
        setDuracionLlamada((prev) => prev + 1);
      }, 1000);
    } else {
      setDuracionLlamada(0);
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [enLlamada]);

  // 🚀 INTERCEPTOR DE PERMISOS AUTOMÁTICO: Consume la variable 'permission' y 'requestPermission' de tu captura
  useEffect(() => {
    (async () => {
      // Validamos de forma pasiva el estado del hook de la cámara
      if (permission && !permission.granted) {
        try {
          console.log("📸 [SOTO PERMS]: Solicitando acceso nativo inicial a los sensores de la cámara...");
          await requestPermission();
        } catch (err) {
          console.warn("⚠️ [SOTO PERMS ERROR]: Fallo al invocar los permisos de hardware:", err);
        }
      }
    })();
  }, []);

  // Inicialización del Chasis General del Sistema de Audio del Dispositivo
  useEffect(() => {
    const prepararSistemaDeAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false, // Forzar salida por el altavoz principal para el mostrador
        });
        console.log("⚙️ [SOTO CORE]: Aislamiento de canales de audio inicializado con éxito.");
      } catch (error) {
        console.error("❌ [SOTO CORE ERROR]: Al configurar el chasis de audio global:", error);
      }
    };
    prepararSistemaDeAudio();
  }, []);

  // ====================================================================
  // BLOQUE 4: PROCESADOR UNIFICADO DE VOZ (SALIDA PROXY FISH AUDIO)
  // ====================================================================
  const reproducirVozDaniela = async (textoParaDecir, emocionDeBaseDatos) => {
    if (isSpeaking || danielaEstaMolesta) return; 

    try {
      await detenerTono();
      setIsDanielaThinking(true);
      setIsSpeaking(true); 

      console.log("🎤 [SOTO VOX]: Solicitando clonación de voz al satélite de Railway...");

      // 🚀 CONEXIÓN MUTADA CON AXIOS: Inmune a las restricciones de CORS de Chrome
      const respuestaAudio = await axios.post(`${BASE_URL}/api/tts`, {
        texto: textoParaDecir,
        emocion_bd: emocionDeBaseDatos || "NORMAL"
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      });

      const data = respuestaAudio.data; 

      // 🧠 REPARACIÓN DE ORO MULTIMEDIA: Estructuramos el prefijo Base64 legítimo para Expo AV
      if (data.success && data.audioContent) {
        console.log("🔊 Stream Base64 recibido de forma exitosa. Inyectando URI de datos...");
        
        // El truco maestro: Le inyectamos el prefijo data:audio para que el reproductor nativo lo asimile
        const formatoAudioURI = data.audioContent.startsWith('data:') 
          ? data.audioContent 
          : `data:audio/mp3;base64,${data.audioContent}`;

        const { sound: nuevoSonido } = await Audio.Sound.createAsync(
          { uri: formatoAudioURI }, 
          { shouldPlay: true }
        );

        setSonido(nuevoSonido);
        setIsDanielaThinking(false);
        setIsCameraActive(false);

        nuevoSonido.setOnPlaybackStatusUpdate(async (status) => {
          if (status.isLoaded && status.didJustFinish) {
            try {
              await nuevoSonido.unloadAsync(); 
            } catch (e) {
              console.log("Aviso: Audio liberado automáticamente por el garbage collector.");
            } finally {
              setIsSpeaking(false);
              console.log("✅ [SOTO VOX]: Finalizó la voz de Daniela. Hardware liberado.");
            }
          }
        });
      } else {
        throw new Error("El proxy no devolvió una carga de audio legítima o el buffer está vacío.");
      }

    } catch (error) {
      console.error("❌ [SOTO VOX ERROR]: Fallo crítico en motor unificado de audio:", error);
      setIsDanielaThinking(false);
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

      // 🚀 TRANSMISIÓN MULTIPARTE SEGURA CON AXIOS
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

      const contextoPersonalidad = vistaActual === 'bussnes' ? 'GERENTE_APIO' : 'NOVIA_POSESIVA';
      console.log(`📡 [SOTO NET]: Despachando transcripción al proxy bajo contexto: ${contextoPersonalidad}`);
      
      // 🚀 CORRECCIÓN DE PARÁMETRO: Cambiado 'texto' por 'message' para sincronizar con tu server.cjs
      const respuestaIA = await axios.post(`${BASE_URL}/api/chat`, {
        message: textoEntendido.trim(),
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
        // Encendemos formalmente tu variable para que pinte en el editor
        setTextoRespuestaActual(textoRespuesta);
        
        setMessages(prev => [...prev, { 
          sender: 'model', 
          texto: textoRespuesta 
        }]);

        // 🔊 LLAMADO EMOCIONAL: Ejecuta el buffer de clonación
        await reproducirVozDaniela(textoRespuesta, dataIA.emocion || "NORMAL");
      }

    } catch (error) {
      console.error("❌ [SOTO AUDIO ERROR]: Fallo en el oído cognitivo de la IA:", error);
    } finally {
      setIsDanielaThinking(false);
    }
  };

    // ====================================================================
  // BLOQUE 5: GESTIÓN DE NOTAS DE VOZ, VISIÓN Y TRANSMISIÓN CLOUD (AXIOS)
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
      
      await procesarLoQueEscuche(uri);
    } catch (error) {
      console.error("❌ [SOTO MEDIA]: Error al finalizar envío de nota de voz:", error);
      setGrabacion(null);
    }
  };

  // Función puente para disparar la Visión desde la cámara de Expo
  const capturarYReconocer = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
      setIsDanielaThinking(true);

      // 🚀 REFACTORIZACIÓN MULTIMEDIA CON AXIOS INMUNE A BLOQUEOS DE RED
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
    } catch (error) {
      console.error("❌ [SOTO VISION]: Error en el puente de visión cloud:", error);
    } finally {
      setIsDanielaThinking(false);
    }
  };

  // 🚀 LA COMPUERTA REFACTORIZADA CON UNIÓN QUÍMICA DE RED (AXIOS)
  const handleEnviarTextoDirecto = async (textoClaro) => {
    if (!textoClaro.trim()) return;
    
    // 🛡️ DETECTOR ANTIDUPLICADO GLOBAL: Protege tu presupuesto de Google AI Studio
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
      
      // 🔗 EL CAMBIO MAESTRO: Sustituimos Fetch por Axios para reventar el candado de Chrome
      const respuesta = await axios.post(`${BASE_URL}/api/chat`, {
        message: textoClaro.trim(), // Ajustado al parámetro estricto de tu server.cjs
        contexto: contextoPersonalidad,
        historial: [...messages, nuevoMensajeUsuario].slice(-6),
        user_id: "gabriel_de_jesus"
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 25000 // 25 segundos de colchón para procesamiento cloud pesado
      });
      
      const data = respuesta.data;
      // Mapeo flexible de variables para asegurar la extracción cognitiva
      const textoRespuesta = data.respuestaDeDaniela || data.respuesta || data.text || "...";
      
      if (textoRespuesta !== "...") {
        // Seteamos el estado de tu línea 39 para que se encienda la variable en tu pantalla
        setTextoRespuestaActual(textoRespuesta);
        
        // 🚀 INYECCIÓN INMEDIATA EN PANTALLA: Pintamos su texto de forma indestructible
        setMessages(prev => [...prev, { 
          sender: 'model', 
          texto: textoRespuesta 
        }]);

        // 🛡️ ENCAPSULAMIENTO DEFENSIVO AUDIO-RESISTENTE
        try {
          // Si tu backend envía el base64 directo, lo puedes interceptar aquí
          await reproducirVozDaniela(textoRespuesta, data.emocion || "NORMAL");
        } catch (audioErr) {
          console.warn("⚠️ [SOTO VOX]: Voz omitida por hardware local, el chat fluye limpio.");
        }
      
        // 📞 INTERCEPTOR DE LLAMADAS ENTRANTES (MIGRADO DE TU VIEJO CODE)
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
            // 🚀 ¡AQUÍ SE ENCIENDE LA VARIABLE APAGADA EN LA RAM DE TU CAPTURA!
            setLlamadaEntranteVisible(true); 
            if (typeof reproducirTono === 'function') reproducirTono();
          }, 2000);
        }
      }
    } catch (error) {
      console.error("❌ [SOTO NET ERROR]: Fuga en el orquestador transaccional:", error);
      
      // Feedback inmediato en pantalla por si Railway está arrancando los motores
      setMessages(prev => [...prev, { 
        sender: 'model', 
        texto: "Mococho, disculpa la latencia, el cerebro en Railway se está calibrando. Intenta de nuevo en 5 segundos." 
      }]);
    } finally {
      setIsDanielaThinking(false);
    }
  };

       // ====================================================================
  // BLOQUE 6: ENRUTADOR Y ORQUESTADOR DE RENDERIZADO CONDICIONAL FINAL
  // ====================================================================
  return (
    <View style={styles.container}>
      
      {/* 6.1 NAVEGACIÓN MODULAR DE PANTALLAS SAAS APIO */}
      {vistaActual === 'home' && (
        <Home 
          messages={messages} // 🚀 CONEXIÓN CRÍTICA: Se inyecta el hilo de memoria al Home para romper la pantalla blanca
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
          
          // 🚀 EL CABLE QUE FALTA: Clava esta línea aquí para que el linter la lea
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
          
          {/* 📸 DESPIERTA LA CÁMARA NATIVA: Etiqueta invisible de control para encender 'Camera' arriba */}
          {isCameraActive && (
            <View style={{ width: 1, height: 1, opacity: 0 }}>
              <Camera ref={cameraRef} />
            </View>
          )}

          <Text style={styles.nombreLlamada}>Daniela</Text>
          
          {enLlamada ? (
            <>
              {/* Cronómetro activo */}
              <Text style={styles.cron稳ometro}>
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
              
              {/* 🟢 BOTÓN ACEPTAR LLAMADA (Mantiene tus MaterialCommunityIcons) */}
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
                      user_id: 'gabriel_de_jesus'
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

              {/* 🚀 DESPIERTA IONICONS Y MATERIALICONS: Los inyectamos como decoración del modal */}
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
