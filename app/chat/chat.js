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

const profilePic = require('../../apio-app/assets/images/foto-perfil-apio.png');

export default function ChatScreen({ 
  onVolver, 
  messages, 
  isDanielaThinking, 
  onEnviarMensajeTexto,
  onAbrirEmpresa,
  onAbrirPerfilFoto,
  cameraRef,
  isCameraActive,
  setIsCameraActive,
  onCapturar,
  
  // 🚀 ADICIÓN DE INGENIERÍA MULTIUSER: Captura el operador dinámico de la sesión
  usuarioLogueado,

  // Las llaves de control remoto para el micrófono
  onIniciarGrabacion,
  onDetenerGrabacion,
  isRecording
}) { 

  // 🚀 ESTADO LOCAL DE TEXTO: Controla el buffer de entrada de forma unificada
  const [message, setMessage] = useState('');
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

    // 📡 TRANSMISIÓN DE DOBLE CANAL REPARADA: 
    // Ahora le escupe al padre (App.js) tanto el texto como el nombre del operario logueado (Ej: Rosmary)
    if (typeof onEnviarMensajeTexto === 'function') {
      onEnviarMensajeTexto(textoParaEnviar, usuarioLogueado || "Gabriel Soto");
    }
  };

  // ====================================================================
  // 🚀 FUNCIÓN HACER FUNCIONAL EL CLIP (ABRIR GALERÍA NATIVA + BASE64)
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

      const archivoAtrapado = resultado.assets[0]; // Muerde el primer asset indexado
      console.log(`✅ [SOTO STORAGE MATCH]: Foto capturada: ${archivoAtrapado.name}`);

      const stringBase64 = await FileSystem.readAsStringAsync(archivoAtrapado.uri, {
        encoding: FileSystem.EncodingType.Base64
      });

      if (typeof onEnviarMensajeTexto === 'function') {
        onEnviarMensajeTexto(
          `[SOTO VISION]: Analiza esta imagen. Es una foto tuya (Daniela). Reconócete usando tu biografía larense y reacciona de forma humana con tu acento guaro de Barquisimeto.`, 
          usuarioLogueado || "Gabriel Soto", 
          stringBase64 
        );
        
        // Inyectamos de forma segura la burbuja en el hilo reactivo local
        if (messages && Array.isArray(messages)) {
          messages.push({
            sender: 'user',
            texto: `📸 Foto adjuntada: ${archivoAtrapado.name}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
      }

    } catch (err) {
      console.error("❌ [SOTO STORAGE CRASH]: Error abriendo los archivos de la galería:", err.message);
    }
  };
  // ====================================================================


  return (
    <SafeAreaView style={[
      styles.safeAreaBlindada,
      { 
        flex: 1, 
        backgroundColor: '#0b141a', // Mantiene el fondo oscuro de WhatsApp
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

              {/* 📎 ICONO DE ADJUNTAR ARCHIVOS (CLIP - FUNCIONAL) */}
              <TouchableOpacity 
                style={{ padding: 4, marginRight: 6 }} 
                disabled={isDanielaThinking} 
                activeOpacity={0.7}
                // 🚀 AQUÍ SE CONECTA LA MAGIA: Al tocar el clip, ejecuta la función de arriba
                onPress={handleSeleccionarArchivoGaleria}
              >
                <MaterialCommunityIcons name="paperclip" size={22} color="#8696a0" style={{ transform: [{ rotate: '315deg' }] }} />
              </TouchableOpacity>


              {/* 📸 ICONO DE CÁMARA INYECTADA */}
              <TouchableOpacity style={{ padding: 4 }} onPress={() => setIsCameraActive(true)} disabled={isDanielaThinking} activeOpacity={0.7}>
                <Ionicons name="camera" size={24} color={isDanielaThinking ? "#2a3942" : "#8696a0"} />
              </TouchableOpacity>

            </View>
            
            {/* 🚀 CONMUTADOR INTELIGENTE DE BOTÓN ACCIÓN DIRECTA */}
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
                  { width: 48, height: 48, borderRadius: 24, backgroundColor: '#00a884', justifyContent: 'center', alignItems: 'center' },
                  isRecording && { backgroundColor: '#ea0038' }
                ]} 
                onPress={() => {
                  if (isRecording) {
                    onDetenerGrabacion(); 
                  } else {
                    onIniciarGrabacion(); 
                  }
                }}
                disabled={isDanielaThinking} 
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name={isRecording ? "stop" : "microphone"} size={22} color="white" />
              </TouchableOpacity>
            )}

          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} // ⬅nt LLAVE FINAL DE CIERRE DE TU COMPONENTE CHAT COGNITIVO

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

