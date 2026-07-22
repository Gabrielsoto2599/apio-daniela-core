// ====================================================================
// CHAT.JS - CABECERA, LÓGICA Y ORQUESTADOR VISUAL MULTIUSER (SOTO SYSTEM)
// Ubicación: app/chat/chat.js (Bloque de Producción Unificado)
// ====================================================================
import { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  Image, ScrollView, KeyboardAvoidingView, Platform,
  ImageBackground, SafeAreaView, StatusBar
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system'; 
import { Audio } from 'expo-av';

const profilePic = require('../../apio-app/assets/images/foto-perfil-apio.png');

export default function ChatScreen({
  messages,
  setMessages,
  isDanielaThinking,
  cameraRef,
  isCameraActive,
  setIsCameraActive,
  onCapturar,
  usuarioLogueado,

  // 🚀 ¡ENCENDIDO INTEGRAL!: Activamos las llaves de control remoto para el micrófono
  onIniciarGrabacion,
  onDetenerGrabacion,
  isRecording
}) {

  // 🚀 ESTADO LOCAL DE TEXTO Y AUDIO: Controla el búfer de entrada y grabación de forma unificada
  const [message, setMessage] = useState('');
  const [grabacionActiva, setGrabacionActiva] = useState(null);
  const [estaGrabandoModoVisual, setEstaGrabandoModoVisual] = useState(false);
  const scrollViewRef = useRef(null);

  // Auto-scroll automatizado con tolerancia de carga asíncrona
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [messages, isDanielaThinking]);

  // 🚀 MOTOR DE ENVÍO BLINDADO: Unidireccional para evitar duplicados en el mostrador
  const enviarMensajeUsuario = () => {
    if (!message.trim() || isDanielaThinking) return;

    const textoParaEnviar = message.trim();
    setMessage(''); // Limpieza inmediata del input en pantalla para mejor UX

    if (typeof onEnviarMensajeTexto === 'function') {
      onEnviarMensajeTexto(textoParaEnviar, usuarioLogueado || "Gabriel Soto");
    }
  };

   // ====================================================================
  // 🎙️ MOTORES DE AUDIO NATIVOS: INICIAR Y DETENER GRABACIÓN MULTIMEDIA
  // ====================================================================
  const handleIniciarGrabacionMicrofono = async () => {
    try {
      console.log("🎙️ [SOTO AUDIO]: Solicitando acceso al hardware del micrófono...");
      const permiso = await Audio.requestPermissionsAsync();
      
      if (permiso.status !== 'granted') {
        console.warn("⚠️ [SOTO AUDIO]: El operador denegó los permisos de grabación de voz.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldRouteThroughEarpieceAndroid: false,
      });

      console.log("🔴 [SOTO AUDIO]: Encendiendo búfer de audio y capturando ondas...");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setGrabacionActiva(recording); // Guardamos la grabación limpia en el estado encendido
      setEstaGrabandoModoVisual(true); 
    } catch (err) {
      console.error("❌ [SOTO AUDIO CRASH]: Error inicializando grabación física:", err.message);
    }
  };

  const handleDetenerGrabacionMicrofono = async () => {
    try {
      if (!grabacionActiva) return;

      console.log("⏹️ [SOTO AUDIO]: Deteniendo captura de sonido y sellando contenedor .m4a...");
      setEstaGrabandoModoVisual(false); 
      
      await grabacionActiva.stopAndUnloadAsync();
      const uriArchivoAudio = grabacionActiva.getURI(); 
      setGrabacionActiva(null); // Limpiamos el estado de forma segura

      if (!uriArchivoAudio) {
        console.warn("⚠️ [SOTO AUDIO]: El archivo de sonido se generó huérfano o vacío.");
        return;
      }

      console.log(`✅ [SOTO AUDIO MATCH]: Nota de voz capturada en: ${uriArchivoAudio}`);

      // 🛡️ PROCESAMIENTO SEGURO: Convertimos a Base64 usando la librería FileSystem que ya está activa arriba
      const audioBase64 = await FileSystem.readAsStringAsync(uriArchivoAudio, {
        encoding: FileSystem.EncodingType.Base64
      });

      if (typeof onEnviarMensajeTexto === 'function') {
        onEnviarMensajeTexto(
          "[SOTO AUDIO NOTE]: Procesa esta nota de voz. Escucha el audio, entiende la intención del operador y respóndele de forma humana con tu acento guaro larense.", 
          usuarioLogueado || "Gabriel Soto", 
          null, 
          audioBase64 
        );

        // 🛡️ INMUTABILIDAD DE REACT: Actualizamos la lista de mensajes sin usar .push()
        if (typeof setMessages === 'function') {
          setMessages(prev => [...prev, {
            sender: 'user',
            texto: "🎙️ Nota de voz enviada",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }
      }
    } catch (err) {
      console.error("❌ [SOTO AUDIO CRASH]: Error cerrando o codificando el archivo Base64:", err.message);
    }
  };
  
    // ====================================================================
  // 📂 MODULO COMPACTO: CLIP MULTIMEDIA CON TEXTO INTEGRADO (SOTO SYSTEM 2026)
  // ====================================================================
  const handleSeleccionarArchivoGaleria = async () => {
    try {
      console.log("📂 [SOTO STORAGE]: Abriendo galería nativa del teléfono...");
      
      const resultado = await DocumentPicker.getDocumentAsync({
        type: ['image/jpeg', 'image/png'], 
        copyToCacheDirectory: true
      });

      if (resultado.canceled || !resultado.assets || resultado.assets.length === 0) {
        console.log("📱 [SOTO STORAGE]: Selección cancelada por el operario.");
        return;
      }

      const archivoAtrapado = resultado.assets[0];
      console.log(`✅ [SOTO STORAGE MATCH]: Foto capturada: ${archivoAtrapado.name}`);

      // 🛡️ CARGA DINÁMICA DE FILE SYSTEM PARA EL BASE64
      let stringBase64 = "";
      try {
        const FileSystemNativo = require('expo-file-system');
        stringBase64 = await FileSystemNativo.readAsStringAsync(archivoAtrapado.uri, {
          encoding: FileSystemNativo.EncodingType.Base64
        });
      } catch (fsErr) {
        console.error("❌ [SOTO STORAGE]: Error convirtiendo imagen a Base64:", fsErr.message);
        alert("No se pudo procesar el formato de la imagen.");
        return;
      }

      // 💬 CAPA MULTIMEDIA INTERACTIVA (ESTILO COMENTARIO DE WHATSAPP)
      // Aprovechamos el cuadro de texto del chat ('message') si el usuario ya escribió algo,
      // o le lanzamos una alerta de entrada de texto nativa al operador en pantalla.
      let textoComentario = message.trim();
      
      if (!textoComentario) {
        textoComentario = "Mira esta imagen que te adjunto."; // Texto de respaldo por defecto
      }

      // 📡 DESPACHO DIRECTO AL PIPELINE COGNITIVO CENTRAL
      if (typeof onEnviarMensajeTexto === 'function') {
        console.log("🚀 [SOTO NET]: Despachando foto y comentario integrado en un solo viaje...");
        
        onEnviarMensajeTexto(
          `[SOTO VISION CON TEXTO INTEGRADO]: El operador te adjuntó una imagen con el siguiente comentario: "${textoComentario}". Analiza la foto, responde al comentario y reacciona de forma humana con tu acento guaro larense.`, 
          usuarioLogueado || "Gabriel Soto", 
          stringBase64 // Pasamos los bits puros de la imagen
        );

        // Actualizamos la interfaz de mensajes de forma síncrona e inmutable
        if (typeof setMessages === 'function') {
          setMessages(prev => [...prev, {
            sender: 'user',
            texto: `🖼️ [Foto]: ${textoComentario}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }
        
        // Limpiamos el cuadro de texto principal tras el envío
        setMessage('');
      }

    } catch (err) {
      console.error("❌ [SOTO STORAGE CRASH]: Error en el módulo de clip integrado:", err.message);
    }
  };

  // 🚀 AQUÍ SIGUE TU APERTURA ORIGINAL COMPLETA SIN CORTES:
  return (
    <SafeAreaView style={[
      styles.safeAreaBlindada,
      { 
        flex: 1, 
        backgroundColor: '#0b141a', 
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
      }
    ]}>

      <StatusBar barStyle="light-content" backgroundColor="#202c33" translucent={true} />
      
      {/* 🛡️ EL ESCUDO PROTECTOR SUPREMO: Evita que el teclado rompa los botones de Android */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          
          {/* ====================================================================
          📸 CAPA MULTIMEDIA ACTIVA: CÁMARA DE VISIÓN DE HARDWARE
          ==================================================================== */}
          {isCameraActive && (
            <View style={styles.cameraContainer}>
              <CameraView style={styles.camera} facing="front" ref={cameraRef}>
                <View style={styles.cameraControls}>
                  <TouchableOpacity style={styles.actionBtnCam} onPress={() => setIsCameraActive(false)}>
                    <Ionicons name="close-circle" size={40} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.captureBtn} onPress={onCapturar} />
                </View>
              </CameraView>
            </View>
          )}

                    {/* ====================================================================
          HEADER SUPERIOR DE LA CONVERSACIÓN (ESTILO WHATSAPP PREMIUM BLINDADO)
          ==================================================================== */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={onVolver} 
              style={styles.backButton} 
              activeOpacity={0.7}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} // 🚀 Amplía el rango táctil del botón de atrás
            >
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onAbrirEmpresa} style={styles.profileContainer} activeOpacity={0.8}>
              <Image source={profilePic} style={styles.profileImage} />
              
              {/* 🟩 REPARACIÓN SANEADA: Eliminamos la propiedad 'data-trigger' web para blindar la APK contra alertas */}
              <View style={styles.onlineDot} />
            </TouchableOpacity>

            <View style={styles.headerInfo}>
              <Text style={styles.headerName}>Daniela IA</Text>
              <Text style={styles.headerStatus}>en línea</Text>
            </View>

            <View style={styles.headerIcons}>
              {/* Añadimos hitSlop a las herramientas multimedia para que respondan al tiro en el mostrador */}
              <TouchableOpacity activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="videocam" size={22} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="call" size={20} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={onAbrirPerfilFoto} 
                activeOpacity={0.7}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ====================================================================
          CUERPO CENTRAL DE MENSAJES (PAPEL TAPIZ EN MODO OSCURO)
          ==================================================================== */}
            <ImageBackground 
            // 🚀 EL ENLACE INDESTRUCTIBLE LOCAL: Carga el fondo al vuelo desde el disco duro, inmune a fallas de internet
            source={require('../../apio-app/assets/images/foto-fondo-apio.png')} // Ajusta los ../ según la altura de tu carpeta app/chat/
            style={styles.chatBackground}
            imageStyle={{ opacity: 0.04, tintColor: '#000000' }}
          >
            <ScrollView 
              ref={scrollViewRef}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              contentContainerStyle={styles.messageList}
              showsVerticalScrollIndicator={false}
            >
              {messages && messages.map((msg, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.messageContainer, 
                    msg.sender === 'user' ? styles.sentContainer : styles.receivedContainer
                  ]}
                >
                  <View style={[styles.bubble, msg.sender === 'user' ? styles.sentBubble : styles.receivedBubble]}>
                    {/* 🛡️ BLINDAJE DE EXTRACCIÓN: Garantiza renderizar el texto sin importar qué clave responda el ORM */}
                    <Text style={styles.messageText}>{msg.texto || msg.text || msg.message || "..."}</Text>
                    <View style={styles.timeRow}>
                      <Text style={styles.timeText}>
                     {msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                      {msg.sender === 'user' && <Ionicons name="checkmark-done" size={16} color="#53bdeb" />}
                    </View>
                  </View>
                </View>
              ))}
              
              {/* INDICADOR REACTIVO DE OPERACIÓN COGNITIVA EN RAILWAY */}
              {isDanielaThinking && (
                <View style={styles.typingContainer}>
                  <Text style={styles.typingText}>Daniela está operando en la PC...</Text>
                </View>
              )}
            </ScrollView>
          </ImageBackground>

          {/* ====================================================================
          BARRA INFERIOR CONTROL REMOTO (INPUT Y DETECTOR MULTIMEDIA WHATSAPP REAL)
          ==================================================================== */}
          <View style={[
            styles.inputArea, 
            { 
              flexDirection: 'row', 
              alignItems: 'center', 
              paddingHorizontal: 8, 
              paddingTop: 6,
              // 🚀 AISLAMIENTO INFERIOR: Colchón de seguridad intacto contra botones táctiles
              paddingBottom: Platform.OS === 'ios' ? 22 : 12, 
              backgroundColor: 'transparent' 
            }
          ]}>
            
            {/* 🛠️ CHASIS PREMIUM DE ENTRADA (ESTILO WHATSAPP COMPLETO) */}
            <View style={[
              styles.inputMainContainer, 
              { 
                flex: 1, 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: '#202c33', // Color de barra oscura de WhatsApp
                borderRadius: 25, 
                paddingHorizontal: 10,
                paddingVertical: 4,
                marginRight: 6
              }
            ]}>
              
              {/* 😃 ICONO DE STICKERS / EMOJIS */}
              <TouchableOpacity style={{ padding: 4 }} disabled={isDanielaThinking} activeOpacity={0.7}>
                <MaterialCommunityIcons name="emoticon-happy-outline" size={24} color="#8696a0" />
              </TouchableOpacity>

              <TextInput
                style={[styles.input, { flex: 1, color: '#e9edef', fontSize: 16, paddingHorizontal: 8, maxHeight: 100 }]}
                placeholder="Escribe un mensaje"
                placeholderTextColor="#8696a0"
                value={message}
                onChangeText={setMessage}
                multiline
                editable={!isDanielaThinking}
              />

              {/* 📎 ICONO DE ADJUNTAR ARCHIVOS (CLIP - ENCIENDE COMENTARIO INTEGRADO) */}
              <TouchableOpacity 
                style={{ padding: 4, marginRight: 6 }} 
                disabled={isDanielaThinking} 
                activeOpacity={0.7}
                // 🚀 SISTEMA DE MULTIMEDIA OPTIMIZADO: Adjunta imágenes y lee el cuadro de texto de un solo viaje
                onPress={handleSeleccionarArchivoGaleria}
              >
                <MaterialCommunityIcons name="paperclip" size={22} color="#8696a0" style={{ transform: [{ rotate: '315deg' }] }} />
              </TouchableOpacity>

              {/* 📸 ICONO DE CÁMARA CONGELADO PREVENTIVAMENTE (SOTO SYSTEM) */}
              <TouchableOpacity 
                style={{ padding: 4 }} 
                // 🛡️ CONGELAMIENTO TÁCTICO: Desactiva el sensor del chat para aislar el crash que tumba la red
                onPress={() => alert("Módulo de cámara en mantenimiento temporal por Soto System.")} 
                disabled={isDanielaThinking} 
                activeOpacity={0.7}
              >
                <Ionicons name="camera" size={24} color="#2a3942" />
              </TouchableOpacity>

            </View>
            
            {/* 🚀 CONMUTADOR INTELIGENTE DE BOTÓN ACCIÓN DIRECTA REPARADO */}
            {message.trim().length > 0 ? (
              <TouchableOpacity 
                style={[styles.sendButton, { width: 48, height: 48, borderRadius: 24, backgroundColor: '#00a884', justifyContent: 'center', alignItems: 'center' }]} 
                onPress={enviarMensajeUsuario}
                disabled={isDanielaThinking} 
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="send" size={22} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[
                  styles.sendButton, 
                  { width: 48, height: 48, borderRadius: 24, backgroundColor: '#00a884', justifyContent: 'center', alignItems: 'center' }
                ]} 
                // 🛡️ CONGELAMIENTO TÁCTICO DE AUDIO: Evita colapsar el hilo de grabación nativa temporalmente
                onPress={() => alert("Módulo de voz en mantenimiento preventivo, chamo.")}
                disabled={isDanielaThinking} 
                activeOpacity={0.5}
              >
                <MaterialCommunityIcons name="microphone" size={22} color="white" />
              </TouchableOpacity>
            )}

          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} // ⬅️ LLAVE FINAL DE CIERRE DE TU COMPONENTE CHAT COGNITIVO SANEADO

// ==========================================================
// 🎨 HOJA DE ESTILOS UNIFICADA CON ESPACIADO DEFENSIVO
// ==========================================================
const styles = StyleSheet.create({
  safeAreaBlindada: { 
    flex: 1, 
    backgroundColor: '#202c33' 
  },
  container: { 
    flex: 1, 
    backgroundColor: '#0b141a' 
  },
  header: {
    height: 60,
    backgroundColor: '#202c33',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backButton: { padding: 5 },
  profileContainer: { position: 'relative', marginLeft: 5 },
  profileImage: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#444' },
  onlineDot: { 
    position: 'absolute', bottom: 0, right: 0, 
    width: 12, height: 12, backgroundColor: '#00a884', 
    borderRadius: 6, borderWidth: 2, borderColor: '#202c33' 
  },
  headerInfo: { marginLeft: 12, flex: 1 },
  headerName: { color: '#e9edef', fontSize: 16, fontWeight: 'bold' },
  headerStatus: { color: '#00a884', fontSize: 12 },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBtn: { padding: 5 },
  chatBackground: { flex: 1 },
  messageList: { padding: 15, paddingBottom: 20 },
  messageContainer: { marginBottom: 10, width: '100%' },
  receivedContainer: { alignItems: 'flex-start' },
  sentContainer: { alignItems: 'flex-end' },
  bubble: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, maxWidth: '85%' },
  receivedBubble: { backgroundColor: '#202c33', borderTopLeftRadius: 0 },
  sentBubble: { backgroundColor: '#005c4b', borderTopRightRadius: 0 },
  messageText: { color: '#e9edef', fontSize: 15 },
  timeRow: { marginTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  timeText: { color: '#8696a0', fontSize: 10 },
  typingContainer: { marginBottom: 10, marginLeft: 5 },
  typingText: { color: '#8696a0', fontSize: 13, fontStyle: 'italic' },
  
  // 🚀 CAMBIO EN INPUT AREA: PaddingBottom estratégico para evitar colisión con barra de Android
  inputArea: { 
    flexDirection: 'row', 
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'android' ? 28 : 12, // 🛡️ SEPARA LA UI DE LOS BOTONES TÁCTILES DEL TELÉFONO
    alignItems: 'flex-end',
    backgroundColor: '#0b141a'
  },
  inputMainContainer: { 
    flex: 1, 
    backgroundColor: '#2a3942', 
    borderRadius: 25, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12,
    minHeight: 48
  },
  emojiIcon: { marginRight: 5 },
  attachIcon: { marginLeft: 5, marginRight: 8 },
  input: { 
    flex: 1, 
    color: '#e9edef', 
    paddingVertical: 10, 
    fontSize: 16,
    maxHeight: 120
  },
  sendButton: {
    backgroundColor: '#00a884',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  
  // Estilos de la cámara embebida (Ojos de Daniela)
  cameraContainer: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 9999, backgroundColor: 'black' },
  camera: { flex: 1, justifyContent: 'flex-end' },
  cameraControls: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 36 },
  actionBtnCam: { padding: 10 },
  captureBtn: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', borderWidth: 5, borderColor: '#ccc' }
}); // ⬅️ ¡Y AQUÍ SE CIERRA EL OBJETO DE ESTILOS DE FORMA COMPLETAMENTE INDEPENDIENTE!

