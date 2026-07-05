// ====================================================================
// BLOQUE 0: IMPORTACIONES DE LIBRERÍAS Y COMPONENTES (SOTO SYSTEM 2026)
// ====================================================================
import { useState, useEffect, useRef } from 'react';
import { View, Platform, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native'; 
import { Audio } from 'expo-av';
import { useCameraPermissions } from 'expo-camera';

// 🚀 INYECCIÓN MAESTRA: Importación oficial unificada de iconos vectoriales para el renderizado
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { BASE_URL } from './src/config/apiConfig';

// Importación de tus módulos independientes (Directorio app/)
import Home from './app/home/home.js';
import ChatScreen from './app/chat/chat.js'; 
import Bussnes from './app/bussnes/bussnes.js';
import Llamadas from './app/llamadas/llamadas.js';
import Novedades from './app/novedades/novedades.js';

export default function App() {
  // ====================================================================
  // BLOQUE 1: ESTADOS GLOBALES (UI, LÓGICA Y MOTOR COGNITIVO)
  // ====================================================================
  const [vistaActual, setVistaActual] = useState('home'); // 'home', 'chat', 'llamadas', 'novedades'
  const [messages, setMessages] = useState([]);
  
  // Control de Hardware y Sensores
  const [sonido, setSonido] = useState(null);
  const [grabacion, setGrabacion] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const cameraRef = useRef(null);

  // Estados de comportamiento de Daniela IA
  const [isDanielaThinking, setIsDanielaThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [danielaEstaMolesta, setDanielaEstaMolesta] = useState(false);
  const [tiempoEspera, setTiempoEspera] = useState(0);
  const [textoRespuestaActual, setTextoRespuestaActual] = useState("");

  // Estados de control de llamadas activas
  const [enLlamada, setEnLlamada] = useState(false);
  const [duracionLlamada, setDuracionLlamada] = useState(0);
  const [llamadaEntranteVisible, setLlamadaEntranteVisible] = useState(false);

  // Modales de Interfaz Flotante
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // ====================================================================
  // CONFIGURACIÓN GLOBAL DE HARDWARE (PERMISOS Y MODOS DE AUDIO)
  // ====================================================================
  const [permission, requestPermission] = useCameraPermissions();

  // Inicialización de permisos de Cámara
  useEffect(() => {
    (async () => {
      if (permission && !permission.granted) {
        await requestPermission();
      }
    })();
  }, [permission]);

  // Inicialización del Sistema de Audio del Dispositivo
  useEffect(() => {
    const prepararSistemaDeAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false, // Forzar salida por altavoz principal
        });
        console.log("⚙️ Sistema de audio de Soto System inicializado con éxito.");
      } catch (error) {
        console.error("❌ Error al configurar el audio global:", error);
      }
    };
    prepararSistemaDeAudio();
  }, []);

    // ====================================================================
  // BLOQUE 2: MOTOR DE AUDIO (RINGTONE UNIFICADO COMPATIBLE DE RED)
  // ====================================================================
  async function reproducirTono() {
    try {
      console.log('⚡ Cargando tono de llamada nativo...');
      
      // 🚀 RUTA SINCROINZADA: Se removió el nivel fantasma 'apio-app'
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/sounds/whatsapp_ringtone.mp3'),
        { isLooping: true }
      );
      setSonido(sound);
      await sound.playAsync();
      console.log('🔔 [SOTO VOX]: Ringtone sonando de fondo en loop.');
    } catch (error) {
      console.error('❌ Error crítico en motor de audio (Ringtone):', error);
    }
  }

  async function detenerTono() {
    if (sonido) {
      try {
        console.log('🛑 Deteniendo tono de forma segura...');
        const status = await sonido.getStatusAsync();
        if (status.isLoaded) {
          await sonido.stopAsync();
          await sonido.unloadAsync();
          console.log('✅ [SOTO VOX]: Memoria del Ringtone liberada con éxito.');
        }
      } catch (error) {
        console.log('⚠️ Aviso en motor de audio (Tono ya liberado):', error);
      } finally {
        setSonido(null);
      }
    }
  }

  // ====================================================================
  // BLOQUE 3: EFECTOS DE VIDA (FLUJO PASIVO Y RECOLECTOR DE TIEMPOS)
  // ====================================================================
  
  // Temporizador de Molestia / Bloqueo cognitivo
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

  // Cronómetro de llamadas de soporte o personales
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

    // ====================================================================
  // BLOQUE 4: PROCESADOR UNIFICADO DE VOZ (SALIDA PROXY FISH AUDIO)
  // ====================================================================
  const reproducirVozDaniela = async (textoParaDecir, emocionDeBaseDatos) => {
    if (isSpeaking || danielaEstaMolesta) return; 

    try {
      await detenerTono();
      setIsDanielaThinking(true);
      setIsSpeaking(true); 

      console.log("🎤 [SOTO VOX]: Solicitando clonación al Proxy local...");

      try {
        // En tu App.js dentro de reproducirVozDaniela:
const respuestaAudio = await fetch(`${BASE_URL}/api/tts`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    texto: textoParaDecir,
    emocion_bd: emocionDeBaseDatos 
  })
});

if (!respuestaAudio.ok) throw new Error("Error en el servidor de audio proxy");

// 🚀 REPARACIÓN DE ORO: Cambiado de 'response.json()' a 'respuestaAudio.json()'
const data = await respuestaAudio.json(); 

        // 🧠 MEJORA MAESTRA: Consumimos el Base64 masticado que envía Node sin bucles for
        if (data.success && data.audioContent) {
          console.log("🔊 Stream Base64 recibido. Inicializando hardware de Expo AV...");
          
          const { sound: nuevoSonido } = await Audio.Sound.createAsync(
            { uri: data.audioContent }, 
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
                console.log("Aviso: Audio liberado automáticamente.");
              } finally {
                setIsSpeaking(false);
                console.log("✅ [SOTO VOX]: Finalizó la voz de Daniela. Hardware liberado.");
              }
            }
          });
        } else {
          throw new Error("El proxy no devolvió una carga de audio legítima.");
        }

      } catch (audioError) {
        console.error("⚠️ Error en generación de voz. El texto permanece:", audioError);
        setIsDanielaThinking(false);
        setIsSpeaking(false);
      }

    } catch (error) {
      console.error("❌ Error general en motor unificado:", error);
      setIsDanielaThinking(false);
      setIsSpeaking(false);
    }
  };

    // ====================================================================
  // BLOQUE 4.1: OÍDO INTELIGENTE (TRANSCRIPCIÓN Y CEREBRO CONTEXTUAL B2B)
  // ====================================================================
  const procesarLoQueEscuche = async (audioUri) => {
    try {
      console.log("👂 [SOTO AUDIO]: Capturando audio para Daniela...");
      setIsDanielaThinking(true);

      const formData = new FormData();
      formData.append('audio', {
        uri: Platform.OS === 'ios' ? audioUri.replace('file://', '') : audioUri,
        type: 'audio/m4a',
        name: 'escucha.m4a',
      });

      const respuestaOido = await fetch(`${BASE_URL}/api/transcribir`, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (!respuestaOido.ok) throw new Error("Error en la transcripción de audio.");
      const { textoEntendido } = await respuestaOido.json();
      console.log("💬 [SOTO AUDIO] Gabriel dijo:", textoEntendido);

      if (!textoEntendido || textoEntendido.trim().length === 0) {
        console.warn("⚠️ No se entendió ningún estímulo de audio.");
        return;
      }

      const nuevoMensajeUsuario = { sender: 'user', texto: textoEntendido };
      setMessages(prev => [...prev, nuevoMensajeUsuario]);

      // 🧠 ARQUITECTURA DE CEREBRO DUAL: Inyección según contexto activo de Apio SaaS
      const contextoPersonalidad = vistaActual === 'bussnes' ? 'GERENTE_APIO' : 'NOVIA_POSESIVA';

      console.log(`📡 Enviando texto transcrito al proxy bajo contexto: ${contextoPersonalidad}`);
      const respuestaIA = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texto: textoEntendido,
          contexto: contextoPersonalidad, 
          historial: messages, // Pasamos el array limpio; Django controlará el contexto con PostgreSQL
          user_id: 'gabriel'   // Cambiado dinámicamente según la huella digital del perfil
        }),
      });

      if (!respuestaIA.ok) throw new Error("Error obteniendo respuesta de Gemini.");
      const data = await respuestaIA.json();

      // 🚀 ACTIVACIÓN UNIFICADA DE RESPUESTA TEXTO + AUDIO EMOCIONAL
      if (data.respuestaDeDaniela) {
        setTextoRespuestaActual(data.respuestaDeDaniela);
        
        // Actualizamos la lista de burbujas en pantalla
        setMessages(prev => [...prev, { 
          sender: 'model', 
          texto: data.respuestaDeDaniela 
        }]);

        // 🔊 LLAMADO CORREGIDO: Inyectamos la respuesta junto con el tag de emoción del ORM
        await reproducirVozDaniela(data.respuestaDeDaniela, data.emocion);
      }

    } catch (error) {
      console.error("❌ Error en el oído cognitivo de Daniela:", error);
    } finally {
      setIsDanielaThinking(false);
    }
  };


  // ====================================================================
  // BLOQUE 5: GESTIÓN DE NOTAS DE VOZ (GRABACIÓN DE DISPOSITIVO)
  // ====================================================================
  const iniciarGrabacion = async () => {
    try {
      console.log("🎤 Solicitando micrófono para grabación física...");
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
        console.log("🔴 Grabando nota de voz...");
      } else {
        console.warn("⚠️ Permisos de micrófono denegados.");
      }
    } catch (err) {
      console.error("❌ Error al iniciar grabación:", err);
    }
  };

  const detenerYEnviarVoz = async () => {
    if (!grabacion) return;
    try {
      console.log("⏹️ Deteniendo y procesando archivo de voz...");
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
      console.error("❌ Error al finalizar envío de nota de voz:", error);
      setGrabacion(null);
    }
  };

  // Función puente para disparar la Visión desde la cámara de Expo
  const capturarYReconocer = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
      setIsDanielaThinking(true);

      const respuestaIA = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          remitente: 'Sistema', 
          texto: '[EVENTO_VISION: Daniela acaba de recibir una foto de Gabriel en tiempo real. Analízala y respóndele con amor]',
          fotoBase64: photo.base64,
          contexto: vistaActual === 'bussnes' ? 'GERENTE_APIO' : 'NOVIA_POSESIVA'
        })
      });

      const { respuestaDeDaniela } = await respuestaIA.json();
      setMessages(prev => [...prev, { sender: 'model', texto: respuestaDeDaniela }]);
      setIsCameraActive(false);
      setIsDanielaThinking(false);
    } catch (error) {
      console.error("❌ Error en el puente de visión:", error);
      setIsDanielaThinking(false);
    }
  };
const handleEnviarTextoDirecto = async (textoClaro) => {
    if (!textoClaro.trim()) return;
    
    // 🚀 DETECTOR ANTIDUPLICADO GLOBAL: Salva tus cuotas de Gemini
    if (isDanielaThinking) return;
    setIsDanielaThinking(true);

    const nuevoMensajeUsuario = { 
      sender: 'user', 
      texto: textoClaro.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, nuevoMensajeUsuario]);
    
    setIsDanielaThinking(true);
    const contextoPersonalidad = vistaActual === 'bussnes' ? 'GERENTE_APIO' : 'NOVIA_POSESIVA';

    try {
      const respuestaIA = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texto: textoClaro.trim(),
          contexto: contextoPersonalidad,
          historial: [...messages, nuevoMensajeUsuario].slice(-6)
        }),
      });
      
      const data = await respuestaIA.json();
      
      if (data && data.respuestaDeDaniela) {
        setTextoRespuestaActual(data.respuestaDeDaniela);
        // 🚀 INYECCIÓN INMEDIATA EN PANTALLA: Pintamos su texto pase lo que pase
        setMessages(prev => [...prev, { 
          sender: 'model', 
          texto: data.respuestaDeDaniela 
        }]);

        // 🛡️ ENCAPSULAMIENTO DEFENSIVO: Si el audio truena por créditos, el chat NO se congela
        try {
          await reproducirVozDaniela(data.respuestaDeDaniela, data.emocion);
        } catch (audioErr) {
          console.warn("⚠️ [SOTO VOX]: Voz omitida por falta de saldo, el texto fluye limpio.");
        }
      
        // 📞 ESCÁNER DE INTENCIONES DE LLAMADA ENTRANTE (MIGRADO DE TU VIEJO CODE)
        const textoMinuscula = data.respuestaDeDaniela.toLowerCase();
        const quiereLlamar = 
          textoMinuscula.includes("llamar") || 
          textoMinuscula.includes("llamo") || 
          textoMinuscula.includes("atiende") || 
          textoMinuscula.includes("atiéndeme") || 
          textoMinuscula.includes("llamada");

        if (quiereLlamar) {
          console.log("📞 Soto System: Intención de llamada interceptada. Disparando Ringtone...");
          setTimeout(() => {
            setLlamadaEntranteVisible(true); // 🚀 ¡AQUÍ SE ENCIENDE TU VARIABLE APAGADA!
            reproducirTono();
          }, 2500);
        }
      }
    } catch (error) {
      console.error("❌ Error enviando texto escrito desde el orquestador:", error);
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
          
          // 🚀 EL ENGRANJE PERFECTO: Conectamos la prop con tu función real de la línea 380
          onEnviarMensajeTexto={handleEnviarTextoDirecto} 
          
          onVolver={() => setVistaActual('home')}
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
              {/* Botón Aceptar Llamada */}
              <TouchableOpacity 
                style={[styles.btnActionCall, { backgroundColor: '#25D366' }]}
                onPress={async () => {
                  try {
                    console.log("📞 Llamada contestada... Abriendo canal de red.");
                    await detenerTono();
                    setEnLlamada(true);
                    
                    const contextoPersonalidad = vistaActual === 'bussnes' ? 'GERENTE_APIO' : 'NOVIA_POSESIVA';
                    
                    const response = await fetch(`${BASE_URL}/api/chat`, { 
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        contexto: contextoPersonalidad,
                        texto: "SISTEMA: Gabriel contestó tu llamada. Inicia la conversación según tu faceta activa.",
                        user_id: 'gabriel'
                      })
                    });
                    
                    const data = await response.json();
                    if (data && data.respuestaDeDaniela) {
                      setTextoRespuestaActual(data.respuestaDeDaniela);
                      
                      setMessages(prev => [...prev, { 
                        sender: 'model', 
                        texto: data.respuestaDeDaniela 
                      }]);

                      // 🔊 CORREGIDO: Se inyecta la respuesta cruzada con el tag de emoción del ORM
                      await reproducirVozDaniela(data.respuestaDeDaniela, data.emocion);
                    }
                  } catch (error) {
                    console.error("Error al conectar canal de voz entrante:", error);
                  }
                }}
              >
                <MaterialCommunityIcons name="phone" size={32} color="white" />
              </TouchableOpacity>

              {/* Botón"> Rechazar Llamada */}
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
} // ⬅️ Fin limpio y único del archivo App.js

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
