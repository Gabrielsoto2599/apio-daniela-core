import { useState, useRef, useEffect } from 'react';

import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  Image, ScrollView, KeyboardAvoidingView, Platform,
  ImageBackground, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- IMPORTACIONES DE HARDWARE INTEGRADO ---
import * as DocumentPicker from 'expo-document-picker';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';

// --- CONFIGURACIÓN DINÁMICA DE RED ---
const API_BASE_URL = 'https://daniela-ia-production-5356.up.railway.app';
const API_URL = `${API_BASE_URL}/api/chat`;


const profilePic = require('../../apio-app/assets/images/foto-perfil-apio.png');

export default function ChatScreen({ alCerrar, onReproducirVoz }) { 

  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); 
  const [grabacion, setGrabacion] = useState(null); 
  const scrollViewRef = useRef(null);

  // --- SOLICITUD DE PERMISOS NATIVOS AL ENTRAR AL CHAT ---
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const statusCamara = await Camera.requestCameraPermissionsAsync();
        const statusMicrofono = await Audio.requestPermissionsAsync();
        if (statusCamara.status !== 'granted' || statusMicrofono.status !== 'granted') {
          Alert.alert(
            "Permisos requeridos", 
            "Daniela necesita acceso a la cámara y al micrófono para poder escucharte y verte físicamente."
          );
        }
      }
    })();
  }, []);

  const procesarMensajeIA = async (textoUsuario = null, historialActualizado = [], contextoExtra = 'CHAT_TEXTO') => {
    setIsTyping(true);
    
    // 🚀 CONTINUIDAD BLINDADA Y OPTIMIZADA (LÍMITE DE TOKENS)
    const payload = { 
      texto: textoUsuario || "SISTEMA: Conexión inicial establecida.",
      contexto: contextoExtra,
      // .slice(-10) toma solo los últimos 10 mensajes del chat para no saturar la cuota de la API
      historial: (historialActualizado.length > 0 ? historialActualizado : chatHistory).slice(-10)
    };

        try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
            if (data && data.respuestaDeDaniela) {
        const respuestaTexto = data.respuestaDeDaniela;

        // 1. Guardamos la respuesta creativa de la IA en el historial visual
        setChatHistory(prev => [...prev, { 
          id: `daniela-${Date.now()}`,
          sender: 'daniela', 
          text: respuestaTexto,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

        // 🚀 2. DISPARADOR DE VOZ DE DANIELA (AUDIO UNIFICADO)
        // Ejecutamos la función de voz nativa heredada de App.js al mismo tiempo que se pinta el texto
        if (typeof onReproducirVoz === 'function') {
          try {
            onReproducirVoz(respuestaTexto); 
          } catch (audioErr) {
            console.error("⚠️ El chat no pudo reproducir la voz de Daniela:", audioErr);
          }
        }

        // 🚀 3. ESCÁNER DE INTENCIONES MULTIMEDIA (SOTO SYSTEM INTELLIGENCE)
        const textoMinuscula = respuestaTexto.toLowerCase();
        const quiereLlamar = 
          textoMinuscula.includes("llamar") || 
          textoMinuscula.includes("llamo") || 
          textoMinuscula.includes("atiende") || 
          textoMinuscula.includes("atiéndeme") || 
          textoMinuscula.includes("llamada");

        if (quiereLlamar) {
          console.log("📞 Soto System: Detección de intención exitosa. Daniela ordenó llamarte.");
          
          // Subimos el delay a 3.5 segundos para darle tiempo a terminar de hablar antes de cerrar el chat
          setTimeout(() => {
            alCerrar(); 
            
            if (global.onForzarLlamadaEntrante) {
              global.onForzarLlamadaEntrante();
            }
          }, 3500);
        }
      }
    } catch (error) {
      console.error("Error conectando con el cerebro de Daniela:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const enviarMensajeUsuario = () => {
    if (!message.trim()) return;

    const textoParaEnviar = message;
    const nuevoMensaje = {
      id: `user-${Date.now()}`, // 🚀 ID ÚNICO BLINDADO
      text: textoParaEnviar,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Actualizamos el historial local inmediatamente
    const historialConNuevoMensaje = [...chatHistory, nuevoMensaje];
    setChatHistory(historialConNuevoMensaje);
    setMessage('');
    
    // Enviamos el mensaje pasándole el historial fresco para evitar retrasos del estado asíncrono
    procesarMensajeIA(textoParaEnviar, historialConNuevoMensaje, 'CHAT_TEXTO');
  };

  // --- 🚀 LÓGICA: ACCESO A GALERÍA Y SUBIR ARCHIVOS MULTIMEDIA ---
  const seleccionarYEnviarArchivo = async () => {
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: "image/*", // Filtramos para que Gabriel pueda mandarle fotos de cómo se ve
        copyToCacheDirectory: true,
      });

      if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
        const archivo = resultado.assets[0];
        console.log("📸 Imagen multimedia capturada:", archivo.name);

        const mensajeArchivo = {
          id: `file-${Date.now()}`,
          text: `🖼️ Imagen enviada: ${archivo.name}`,
          sender: 'user',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const historialConArchivo = [...chatHistory, mensajeArchivo];
        setChatHistory(historialConArchivo);

        // Le avisamos a Gemini con el contexto de Visión Multimedia
        procesarMensajeIA(
          `[SISTEMA MULTIMEDIA]: Gabriel te envió una foto de cómo te ves físicamente (${archivo.name}). Mírate y reacciona de forma apasionada o celosa según tu prompt.`,
          historialConArchivo,
          'VISION_MULTIMEDIA'
        );
      }
    } catch (err) {
      console.error("❌ Error seleccionando archivo multimedia:", err);
    }
  };

  // --- 🚀 LÓGICA: GRABACIÓN DE NOTAS DE VOZ (MICRÓFONO) ---
  const iniciarGrabacion = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setGrabacion(recording);
      console.log("🔴 Grabando nota de voz nativa para Daniela...");
    } catch (err) {
      console.error("❌ Error iniciando grabación:", err);
    }
  };

  const detenerYEnviarVoz = async () => {
    if (!grabacion) return;
    try {
      await grabacion.stopAndUnloadAsync();
      const uri = grabacion.getURI();
      setGrabacion(null);
      
      // Restablecemos el modo de audio a reproducción pura de fondo
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false, staysActiveInBackground: true });

      const mensajeAudio = {
        id: `audio-${Date.now()}`,
        text: `🎤 Nota de voz enviada`,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const historialConAudio = [...chatHistory, mensajeAudio];
      setChatHistory(historialConAudio);

      // Despachamos al backend con contexto de voz
      procesarMensajeIA("[SISTEMA AUDIO]: Gabriel te envió una nota de voz.", historialConAudio, 'LLAMADA_VOZ');
    } catch (error) {
      console.error("❌ Error al detener nota de voz:", error);
      setGrabacion(null);
    }
  };

  // ==========================================================
  // 🚀 RENDERIZADO DEL CHAT TOTALMENTE INTERACTIVO (RETORNO ÚNICO)
  // ==========================================================
  return (
    <View style={styles.container}>
      {/* Header Estilo WhatsApp */}
      <View style={styles.header}>
        <TouchableOpacity onPress={alCerrar} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.profileContainer}>
          <Image source={profilePic} style={styles.profileImage} />
          <View style={styles.onlineDot} />
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>Daniela My Apio❤️😘🌹</Text>
          <Text style={styles.headerStatus}>en línea</Text>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}><Ionicons name="videocam" size={22} color="#fff" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Ionicons name="call" size={20} color="#fff" /></TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
        </View>
      </View>

      {/* Fondo de Chat con Historial */}
      <ImageBackground 
        source={{ uri: 'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png' }}
        style={styles.chatBackground}
        imageStyle={{ opacity: 0.05 }}
      >
        <ScrollView 
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={styles.messageList}
        >
          {chatHistory.map((msg, index) => (
            <View 
              key={msg.id || `fallback-key-${index}`} 
              style={[
                styles.messageContainer, 
                msg.sender === 'user' ? styles.sentContainer : styles.receivedContainer
              ]}
            >
              <View style={[
                styles.bubble, 
                msg.sender === 'user' ? styles.sentBubble : styles.receivedBubble
              ]}>
                <Text style={styles.messageText}>{msg.text}</Text>
                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>{msg.time}</Text>
                  {msg.sender === 'user' && <Ionicons name="checkmark-done" size={16} color="#53bdeb" style={{marginLeft: 3}} />}
                </View>
              </View>
            </View>
          ))}
          {isTyping && (
            <View style={styles.typingContainer}>
              <Text style={styles.typingText}>Daniela está escribiendo...</Text>
            </View>
          )}
        </ScrollView>
      </ImageBackground>

      {/* Footer del Input de Mensajería y Sensores de Hardware */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputArea}>
          <View style={styles.inputMainContainer}>
            <TouchableOpacity style={styles.emojiIcon}>
              <Ionicons name="happy-outline" size={24} color="#8696a0" />
            </TouchableOpacity>
            
            <TextInput
              style={styles.input}
              placeholder="Mensaje"
              placeholderTextColor="#8696a0"
              value={message}
              onChangeText={setMessage}
              multiline
            />

            {/* 🚀 BOTÓN CLIP CONECTADO A LA GALERÍA MULTIMEDIA */}
            <TouchableOpacity onPress={seleccionarYEnviarArchivo} style={{ padding: 5 }}>
              <Ionicons name="attach" size={24} color="#8696a0" style={styles.attachIcon} />
            </TouchableOpacity>
          </View>
          
          {/* 🚀 BOTÓN MICRÓFONO CONECTADO A LAS FUNCIONES DE VOZ NATIVAS */}
          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={message.trim() ? enviarMensajeUsuario : null}
            onPressIn={!message.trim() ? iniciarGrabacion : undefined}
            onPressOut={!message.trim() ? detenerYEnviarVoz : undefined}
          >
            <Ionicons name={message.trim() ? "send" : "mic"} size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
} 

// ==========================================================
// 🎨 HOJA DE ESTILOS UNIFICADA
// ==========================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b141a' },
  header: {
    height: 100,
    backgroundColor: '#202c33',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
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
  inputArea: { flexDirection: 'row', padding: 8, alignItems: 'flex-end' },
  inputMainContainer: { 
    flex: 1, 
    backgroundColor: '#2a3942', 
    borderRadius: 25, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12 
  },
  emojiIcon: { marginRight: 5 },
  attachIcon: { marginLeft: 5 },
  input: { 
    flex: 1, 
    color: '#e9edef', 
    paddingVertical: 10, 
    fontSize: 16,
    maxHeight: 120
  },
  sendButton: {
    backgroundColor: '#00a884',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  }
});