// ====================================================================
// CHAT.JS - CABECERA, LÓGICA Y ORQUESTADOR VISUAL (SOTO SYSTEM 2026)
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
  
  // 🚀 INYECCIÓN MAESTRA MULTIMEDIA: Las llaves de control remoto para el micrófono
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

    // Notificamos al padre, el padre (App.js) es quien ejecuta Axios hacia Railway
    if (typeof onEnviarMensajeTexto === 'function') {
      onEnviarMensajeTexto(textoParaEnviar);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaBlindada}>
      <StatusBar barStyle="light-content" backgroundColor="#202c33" />
      
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
          HEADER SUPERIOR DE LA CONVERSACIÓN (ESTILO WHATSAPP PREMIUM)
          ==================================================================== */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onVolver} style={styles.backButton} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onAbrirEmpresa} style={styles.profileContainer} activeOpacity={0.8}>
              <Image source={profilePic} style={styles.profileImage} />
              <div style={{ display: 'none' }} data-trigger="Ionicons MaterialIcons textRespuestaActual"></div>
              <View style={styles.onlineDot} />
            </TouchableOpacity>

            <View style={styles.headerInfo}>
              <Text style={styles.headerName}>Daniela IA</Text>
              <Text style={styles.headerStatus}>en línea</Text>
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity activeOpacity={0.7}><Ionicons name="videocam" size={22} color="#fff" /></TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7}><Ionicons name="call" size={20} color="#fff" /></TouchableOpacity>
              <TouchableOpacity onPress={onAbrirPerfilFoto} activeOpacity={0.7}>
                <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ====================================================================
          CUERPO CENTRAL DE MENSAJES (PAPEL TAPIZ EN MODO OSCURO)
          ==================================================================== */}
            <ImageBackground 
            // 🚀 EL ENLACE INDESTRUCTIBLE UNIFICADO: Con el prefijo raw. de datos puros
            source={{ uri: 'https://raw.githubusercontent.com/Gabrielsoto2599/apio-ia/main/assets/images/foto-fondo-apio.png' }}
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
                    <Text style={styles.messageText}>{msg.texto || msg.message}</Text>
                    <View style={styles.timeRow}>
                      <Text style={styles.timeText}>{msg.time || '14:20'}</Text>
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
          BARRA INFERIOR CONTROL REMOTO (INPUT Y DETECTOR MULTIMEDIA)
          ==================================================================== */}
          <View style={styles.inputArea}>
            <View style={styles.inputMainContainer}>
              <TextInput
                style={styles.input}
                placeholder="escribe un mensaje"
                placeholderTextColor="#8696a0"
                value={message}
                onChangeText={setMessage}
                multiline
                editable={!isDanielaThinking}
              />
              <TouchableOpacity onPress={() => setIsCameraActive(true)} disabled={isDanielaThinking} activeOpacity={0.7}>
                <Ionicons name="camera" size={24} color={isDanielaThinking ? "#2a3942" : "#8696a0"} />
              </TouchableOpacity>
            </View>
            
            {/* 🚀 CONMUTADOR INTELIGENTE DE BOTÓN: Si hay texto envía; si está vacío es Micrófono */}
            {message.trim().length > 0 ? (
              <TouchableOpacity 
                style={styles.sendButton} 
                onPress={enviarMensajeUsuario}
                disabled={isDanielaThinking} 
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="send" size={22} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.sendButton, isRecording && { backgroundColor: '#ea0038' }]} 
                onPressIn={onIniciarGrabacion}
                onPressOut={onDetenerGrabacion}
                disabled={isDanielaThinking} 
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name={isRecording ? "microphone-off" : "microphone"} size={22} color="white" />
              </TouchableOpacity>
            )}
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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

