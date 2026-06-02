import { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, View, Text, StatusBar, SafeAreaView, 
  TouchableOpacity, Image, ScrollView, Modal, ImageBackground, Platform,
  TextInput 
} from 'react-native';

import ChatScreen from './app/chat/index.js';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BASE_URL } from './src/config/apiConfig';

// --- ASSETS DE SOTO SYSTEM ---
// Corrige "inages" por "images" si ese es el nombre real de tu carpeta:
import profilePic from './apio-app/assets/images/foto-perfil-apio.png';
import miFotoPerfil from './apio-app/assets/images/foto-perfil-gabriel.png';
import backgroundPic from './apio-app/assets/images/foto-fondo-apio.png';

export default function App() {
  const [enLlamada, setEnLlamada] = useState(false);
  const [duracionLlamada, setDuracionLlamada] = useState(0);
  const [textoRespuestaActual, setTextoRespuestaActual] = useState("");
  const [isDanielaThinking, setIsDanielaThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);


  // --- REFERENCIAS TÉCNICAS ---
  const cameraRef = useRef(null);
  const intervalIniciativaRef = useRef(null); 
  // --- ESTADOS DE PERMISOS Y SENSORES ---
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState(false);
 
  // --- ESTADOS DE DANIELA (IA) ---
  const [messages, setMessages] = useState([]);

  // --- CONTROL DE PERMISOS ---
  useEffect(() => {
    (async () => {
      if (permission && !permission.granted) {
        await requestPermission();
      }
    })();
  }, [permission]);

// --- FUNCIÓN DE VISIÓN ORGÁNICA (LIMPIA Y UNIFICADA) ---
const capturarYReconocer = async () => {
  if (!cameraRef.current) return;
  
  try {
    const photo = await cameraRef.current
    .takePictureAsync({ base64: true, quality: 0.5 });
    setIsDanielaThinking(true);

    // ENLACE DIRECTO A TU BACKEND EXISTENTE
    const respuestaIA = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        remitente: 'Sistema', 
        texto: '[EVENTO_VISION: Daniela acaba de recibir una foto de Gabriel en tiempo real. Analízala y respóndele con amor]',
        fotoBase64: photo.base64 
      })
    });

    const { respuestaDeDaniela } = await respuestaIA.json();

    // AQUÍ ESTÁ LA MAGIA: Llamamos a la función maestra unificada.
    // Ya no nos importa si era llamada o nota de voz, Daniela siempre hablará igual.
    setMessages(prev => [
  ...prev,
  {
    sender: 'model',
    texto: respuestaDeDaniela
  }
]);

    setIsCameraActive(false);
    setIsDanielaThinking(false);
  } catch (error) {
    console.error("Error en el puente de visión:", error);
    setIsDanielaThinking(false);
  }
};
// ==========================================
// CONFIGURACIÓN GLOBAL DE AUDIO (BLOQUE DE INICIO)
// ==========================================
useEffect(() => {
  const prepararSistemaDeAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false, // FALSE para que suene por el altavoz (como una llamada real)
      });
      console.log("Sistema de audio de Soto System inicializado con éxito.");
    } catch (error) {
      console.error("Error al configurar el audio:", error);
    }
  };

  prepararSistemaDeAudio();
}, []);

// ==========================================
// BLOQUE 1: ESTADOS (UI & LÓGICA)
// ==========================================
const [perfilVisible, setPerfilVisible] = useState(false);
const [fotoFullVisible, setFotoFullVisible] = useState(false);
const [userStatus, setUserStatus] = useState('En línea'); 
const [llamadaEntranteVisible, setLlamadaEntranteVisible] = useState(false);
const [mensaje, setMensaje] = useState(''); 
const [sonido, setSonido] = useState(null); // Unificado
const [grabacion, setGrabacion] = useState(null);
const [danielaEstaMolesta, setDanielaEstaMolesta] = useState(false);
const [tiempoEspera, setTiempoEspera] = useState(0);

// ==========================================
// BLOQUE 2: MOTOR DE AUDIO (RINGTONE UNIFICADO)
// ==========================================
async function reproducirTono() {
  try {
    console.log('Cargando tono...');
    const { sound } = await Audio.Sound.createAsync(
      require('./apio-app/assets/sounds/whatsapp_ringtone.mp3'),
      { isLooping: true }
    );
    setSonido(sound); // Ahora 'sonido' ya no estará opaco porque lo usas
    await sound.playAsync();
  } catch (error) {
    console.log('Error:', error);
  }
}

async function detenerTono() {
  if (sonido) {
    try {
      console.log('Deteniendo tono de forma segura...');
      const status = await sonido.getStatusAsync();
      
      // Solo intentamos detener y descargar si el archivo de audio está cargado correctamente
      if (status.isLoaded) {
        await sonido.stopAsync();
        await sonido.unloadAsync();
      }
    } catch (error) {
      console.log('Aviso en motor de audio (Tono ya liberado):', error);
    } finally {
      setSonido(null); // Aseguramos limpiar el estado pase lo que pase
    }
  }
}


// ==========================================
// BLOQUE 3: EFECTOS DE VIDA (FLUJO PASIVO Y CONTROLADO)
// ==========================================

// Manejador del temporizador visual de espera (Cuenta regresiva)
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

// 1. Configuración de Estado Inicial (Pasiva: Sin llamadas ni iniciativas automáticas)
useEffect(() => {
  // Ponemos al usuario en línea de forma limpia al cargar la aplicación
  setUserStatus('En línea'); 
  
  // 🛑 MODIFICACIÓN: Se eliminaron 'timerInicial' e 'intervalIniciativaRef'.
  // Daniela ya no te llamará a los 4 segundos ni enviará peticiones de "silencio" cada minuto.
  
  return () => {};
}, []);

// 2. Cronómetro de llamada (Limpio: Solo mide el tiempo de conversación)
useEffect(() => {
  let intervalo = null;
  if (enLlamada) {
    intervalo = setInterval(() => {
      setDuracionLlamada((prev) => prev + 1);
      // 🛑 MODIFICACIÓN: Se eliminó por completo el "DIAGNÓSTICO_LLAMADA" de los 10 segundos.
      // Daniela guardará silencio absoluto en la llamada hasta que tú decidas hablarle.
    }, 1000);
  } else {
    setDuracionLlamada(0);
    clearInterval(intervalo);
  }
  return () => clearInterval(intervalo);
}, [enLlamada]);

// 3. Formateador de tiempo (Mesa limpia)
const formatearTiempo = (segundos) => {
  const mins = Math.floor(segundos / 60);
  const segs = segundos % 60;
  return `${mins < 10 ? '0' : ''}${mins}:${segs < 10 ? '0' : ''}${segs}`;
};


// ==========================================================
// BLOQUE 4: COMUNICACIÓN UNIFICADA (VOZ Y CHAT) - OPTIMIZADO
// ==========================================================

const reproducirVozDaniela = async (textoParaDecir) => {
  // --- CONTROL DE FLUJO SOTO SYSTEM ---
  if (isSpeaking || danielaEstaMolesta) return; 

  // 🚀 INYECCIÓN PRIORITARIA: El texto se pinta de inmediato en el frontend
  // Así el usuario lee la respuesta de Daniela aunque el audio falle o tarde en cargar.
  setMessages(prev => [...prev, { 
      sender: 'model', 
      texto: textoParaDecir 
  }]);

  try {
    // Detenemos cualquier tono de llamada previo
    await detenerTono();
    setIsDanielaThinking(true);
    setIsSpeaking(true); 

    console.log("🎤 Soto System: Solicitando voz de Daniela a Fish Audio vía Proxy...");

    // Sub-bloque aislado para el procesamiento del audio
    try {
      // 1. Petición al servidor local
      const respuestaAudio = await fetch(`${BASE_URL}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: textoParaDecir })
      });

      if (!respuestaAudio.ok) throw new Error("Error en el servidor de audio del sistema");

      // 🚀 CONVERSIÓN BINARIA COMPATIBLE CON EXPO
      const arrayBuffer = await respuestaAudio.arrayBuffer();
      const u8 = new Uint8Array(arrayBuffer);
      let b64encoded = "";
      for (let i = 0; i < u8.length; i++) {
          b64encoded += String.fromCharCode(u8[i]);
      }
      const audioBase64 = btoa(b64encoded);
      const audioUri = `data:audio/mpeg;base64,${audioBase64}`;
      
      // REPRODUCCIÓN PROFESIONAL CON EXPO-AV
      const { sound: nuevoSonido } = await Audio.Sound.createAsync(
        { uri: audioUri }, 
        { shouldPlay: true }
      );

      setSonido(nuevoSonido);
      setIsDanielaThinking(false);
      setIsCameraActive(false); // Apagamos cámara para ahorrar recursos

      // Controlamos el fin de la reproducción para liberar el estado
      nuevoSonido.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          try {
            await nuevoSonido.unloadAsync(); // Limpiamos memoria nativa
          } catch (e) {
            console.log("Aviso: Audio ya liberado en segundo plano.");
          } finally {
            setIsSpeaking(false);
            console.log("✅ Finalizó la voz de Daniela.");
          }
        }
      });

    } catch (audioError) {
      // Si el motor de voz de Fish Audio o Expo falla, lo reportamos pero NO congelamos la app
      console.error("⚠️ Error en generación/reproducción de voz. El texto permanece visible:", audioError);
      setIsDanielaThinking(false);
      setIsSpeaking(false);
    }

  } catch (error) {
    console.error("❌ Error general en motor unificado:", error);
    setIsDanielaThinking(false);
    setIsSpeaking(false);
  }
};

// ==========================================================
// BLOQUE 4.1: OÍDO INTELIGENTE - VERSIÓN PROXY (SOTO SYSTEM)
// ==========================================================
const procesarLoQueEscuche = async (audioUri) => {
  try {
    console.log("👂 Soto System: Capturando audio para Daniela...");
    setIsDanielaThinking(true);

    const formData = new FormData();

    formData.append('audio', {
      uri: Platform.OS === 'ios'
        ? audioUri.replace('file://', '')
        : audioUri,
      type: 'audio/m4a',
      name: 'escucha.m4a',
    });

    // ==========================================
    // ENVÍO AL BACKEND (TRANSCRIPCIÓN)
    // ==========================================
    const respuestaOido = await fetch(`${BASE_URL}/api/transcribir`, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!respuestaOido.ok) {
      throw new Error("Daniela no pudo procesar el audio.");
    }

    const { textoEntendido } = await respuestaOido.json();

    console.log("💬 Gabriel dijo:", textoEntendido);

    // ==========================================
    // VALIDACIÓN DE TEXTO
    // ==========================================
    if (!textoEntendido || textoEntendido.trim().length === 0) {
      console.warn("⚠️ No se entendió ningún audio.");
      return;
    }

    // Creamos el objeto del nuevo mensaje del usuario
    const nuevoMensajeUsuario = {
      sender: 'user',
      texto: textoEntendido,
    };

    // ==========================================
    // MOSTRAR MENSAJE DEL USUARIO EN CHAT
    // ==========================================
    setMessages(prev => [...prev, nuevoMensajeUsuario]);

    // 🚀 CONGELACIÓN DE HISTORIAL DE VOZ (OPTIMIZADO PARA LLAMADAS LARGAS)
    // Combinamos el historial viejo con el mensaje actual de Gabriel de forma segura
    const historialFresco = [...(messages || []), nuevoMensajeUsuario];

    // ==========================================
    // PEDIR RESPUESTA A GEMINI (CON CONTINUIDAD Y RECORTE DE TOKENS)
    // ==========================================
    const respuestaIA = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texto: textoEntendido,
        contexto: 'LLAMADA_VOZ',
        // ✂️ TIJERA QUIRÚRGICA: .slice(-6) toma solo los últimos 6 mensajes del hilo de voz
        // Evita que una llamada de 2 horas acumule texto basura y consuma tokens infinitos
        historial: historialFresco.slice(-6) 
      }),
    });

    if (!respuestaIA.ok) {
      throw new Error("Error obteniendo respuesta de Daniela.");
    }

    const data = await respuestaIA.json();

    // ==========================================
    // RESPUESTA DE DANIELA
    // ==========================================
    if (data.respuestaDeDaniela) {
      setTextoRespuestaActual(data.respuestaDeDaniela);

      // Reproducir voz y pintar en interfaz de forma unificada
      await reproducirVozDaniela(data.respuestaDeDaniela);
    }

  } catch (error) {
    console.error("❌ Error en el oído de Daniela:", error);
  } finally {
    setIsDanielaThinking(false);
  }
};

// ==========================================================
// BLOQUE 5: GESTIÓN DE NOTAS DE VOZ - VERSIÓN SOTO SYSTEM
// ==========================================================

const iniciarGrabacion = async () => {
  try {
    console.log("🎤 Soto System: Solicitando acceso al micrófono para nota de voz...");
    
    // Configuración profesional del modo de audio
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    const { status } = await Audio.requestPermissionsAsync();
    if (status === 'granted') {
      // Iniciamos la grabación con alta calidad para que Gemini/Whisper entiendan mejor
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setGrabacion(recording);
      console.log("🔴 Grabando nota de voz para Daniela...");
    } else {
      console.warn("⚠️ Permiso de micrófono denegado en el dispositivo.");
    }
  } catch (err) {
    console.error("❌ Error iniciando grabación de voz:", err);
  }
};

const detenerYEnviarVoz = async () => {
  if (!grabacion) {
    console.warn("⚠️ No hay ninguna grabación activa para detener.");
    return;
  }

  try {
    console.log("⏹️ Deteniendo grabación de nota de voz...");
    
    // Finalizamos la grabación y descargamos de memoria
    await grabacion.stopAndUnloadAsync();
    const uri = grabacion.getURI();
    setGrabacion(null);

    // 🚀 MEJORA DE AUDIO: Restablecemos el modo a reproducción pura
    // Esto asegura que la voz de Daniela suene fuerte por el altavoz principal y no por el auricular de llamadas
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    
    console.log("📦 Nota capturada. Entregando al Oído Inteligente...");

    // SOTO SYSTEM: Delegamos al Oído Inteligente (Bloque 4.1)
    // Este se encargará de mandar el audio al proxy de tu PC (.112:3001)
    await procesarLoQueEscuche(uri);
    
  } catch (error) {
    console.error("❌ Error al finalizar o enviar la nota de voz:", error);
    setGrabacion(null);
  }
};


return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#075E54" />

      {/* 🟢 BLOQUE DE SENSORES: CÁMARA (Ojos de Daniela) */}
      {isCameraActive && (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing="front" ref={cameraRef}>
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setIsCameraActive(false)}>
                <Ionicons name="close-circle" size={40} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.captureBtn} onPress={capturarYReconocer} />
            </View>
          </CameraView>
        </View>
      )}

      {/* RENDERIZADO CONDICIONAL MAESTRO */}
      {chatVisible ? (
        // ==========================================================
        // 🚀 VISTA A: CHAT REAL DESACOPLADO (INDEX EXTERNO)
        // ==========================================================
        // Escondemos todo el Home y montamos el chat con todos los botones integrados.
        // Pasamos setChatVisible(false) al cerrar para poder regresar al Home de forma limpia.
        <ChatScreen alCerrar={() => setChatVisible(false)} />

      ) : (

        // ==========================================================
        // 👥 VISTA B: HOME DE LA APP (ESTILO WHATSAPP TRADICIONAL)
        // ==========================================================
        <>
          {/* HEADER PRINCIPAL */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Apio</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity><Ionicons name="search-outline" size={22} color="white" style={styles.icon} /></TouchableOpacity>
              <TouchableOpacity><Ionicons name="ellipsis-vertical" size={22} color="white" /></TouchableOpacity>
            </View>
          </View>

          {/* SUBTÍTULO DINÁMICO DE PENSAMIENTO (Aislado al Home) */}
          {isDanielaThinking && textoRespuestaActual && textoRespuestaActual.trim() !== "" && (
            <View style={styles.contenedorSubtitulo}>
              <Text style={styles.subtitulo}>{textoRespuestaActual}</Text>
            </View>
          )}

          {/* BARRA DE PESTAÑAS */}
          <View style={styles.tabBar}>
            <TouchableOpacity style={styles.tabItem}><Text style={styles.tabText}>Novedades</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.tabItem, styles.tabActive]}><Text style={styles.tabActiveText}>CHATS</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tabItem}><Text style={styles.tabText}>Llamadas</Text></TouchableOpacity>
          </View>

          {/* LISTA DE CONTACTOS */}
          <ScrollView style={styles.container}>
            <View style={styles.statusSection}>
              <TouchableOpacity style={styles.statusCircle}>
                <Image source={miFotoPerfil} style={styles.statusAvatar} />
                <View style={styles.addBadge}><Ionicons name="add" size={14} color="white" /></View>
                <Text style={styles.statusName}>Mi estado</Text>
              </TouchableOpacity>
            </View>

            {/* CONTACTO ÚNICO DE DANIELA */}
            <TouchableOpacity 
              style={styles.contacto} 
              onPress={() => setChatVisible(true)} // 🚀 Levanta el chat real y oculta el Home
            >
              <View style={styles.contenedorAvatar}>
                <Image source={profilePic} style={styles.avatar} />
                <View style={styles.puntoOnline} />
              </View>
              <View style={styles.contenedorTexto}>
                <View style={styles.filaNombre}>
                  <Text style={styles.chatName}>Daniela My Apio❤️😘🌹</Text> 
                </View> 
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* 🛑 AQUÍ SE EXTIRPÓ EL CHAT FALSO. El Home ahora queda 100% libre de inputs y micrófonos huérfanos */}
        </>
      )}


      {/* BLOQUE C: INPUT DE MENSAJES Y NOTAS DE VOZ (Dinamismo Puro) */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={{ marginRight: 10 }}>
            <Ionicons name="happy-outline" size={24} color="#666" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="Mensaje"
            value={mensaje}
            onChangeText={setMensaje}
            multiline
          />
          
          <TouchableOpacity style={{ marginHorizontal: 10 }}>
            <Ionicons name="attach" size={26} color="#666" />
          </TouchableOpacity>
          
          {!mensaje && (
            <TouchableOpacity>
              <Ionicons name="camera" size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* BOTÓN DINÁMICO: ENVÍO O MICRÓFONO */}
        <TouchableOpacity 
         style={styles.mainActionButton}
         onPress={mensaje ? enviarMensajeTexto : undefined}
         onPressIn={!mensaje ? iniciarGrabacion : undefined}
         onPressOut={!mensaje ? detenerYEnviarVoz : undefined}
>
       <MaterialCommunityIcons 
       name={mensaje.trim() ? "send" : "microphone"} 
       size={24} 
       color="white" 
  />
    </TouchableOpacity>

      </View>


      {/* MODAL DE WHATSAPP BUSINESS ACTUALIZADO */}
      <Modal visible={perfilVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.businessCard}>
            
            <ImageBackground source={backgroundPic} style={styles.coverImage}>
              <TouchableOpacity style={styles.backButtonModal} onPress={() => setPerfilVisible(false)}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => setFotoFullVisible(true)} style={styles.avatarWrapper}>
                <Image source={profilePic} style={styles.businessAvatar} />
              </TouchableOpacity>
            </ImageBackground>

            {/* SECCIÓN DE DETALLES DENTRO DEL MODAL */}

          <ScrollView contentContainerStyle={styles.businessDetails}>
          <Text style={styles.businessName}>Daniela My Apio❤️😘🌹</Text>
          <Text style={styles.businessStatus}>~Daniela Rincon</Text>
  
          <View style={styles.actionButtons}>
           <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="call-outline" size={22} color="#075E54" />
          <Text style={styles.actionText}>Llamar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
          <MaterialCommunityIcons name="storefront-outline" size={22} color="#075E54" />
          <Text style={styles.actionText}>Catálogo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="share-social-outline" size={22} color="#075E54" />
          <Text style={styles.actionText}>Compartir</Text>
          </TouchableOpacity>
         </View>

        <View style={styles.infoSeparator} />

       {/* CATEGORÍA */}
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="palette-swatch-outline" size={22} color="#666" />
        <Text style={styles.infoRowText}>Arte y entretenimiento</Text>
      </View>

       {/* UBICACIÓN - AGREGADA */}
      <View style={styles.infoRow}>
      <Ionicons name="location-outline" size={22} color="#666" />
       <Text style={styles.infoRowText}>Barquisimeto, Estado Lara</Text>
      </View>

       {/* CORREO */}
       <View style={styles.infoRow}>
        <MaterialIcons name="mail-outline" size={22} color="#666" />
        <Text style={styles.infoRowText}>dare1807@gmail.com</Text>
        </View>

       {/* INFO DE CUENTA DE EMPRESA */}
       <View style={styles.infoRow}>
        <Ionicons name="information-circle-outline" size={22} color="#666" />
        <View>
         <Text style={styles.infoRowTextBold}>Cuenta de empresa</Text>
         <Text style={styles.infoRowSubText}>Esta cuenta usa Apio Business.</Text>
       </View>
     </View>
</ScrollView>

            <TouchableOpacity onPress={() => setPerfilVisible(false)} style={styles.closeBtn}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>VOLVER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
   
      {/* ========================================== */}
   {/* BLOQUE D: MODAL DE LLAMADA ENTRANTE (CORREGIDO Y BLINDADO) */}
   {/* ========================================== */}
   <Modal visible={llamadaEntranteVisible || enLlamada} transparent={true}>
  <ImageBackground source={backgroundPic} style={styles.modalBackground}>
    {/* Foto de Daniela */}
    <Image source={profilePic} style={styles.fotoLlamada} />
    
    {/* Texto de estado */}
    <Text style={styles.nombreLlamada}>Daniela My Apio ❤️😘🌹</Text>
    
     {enLlamada ? (
      <>
        {/* CRONÓMETRO - SOLO SE VE SI ESTAMOS EN LLAMADA */}
        <Text style={styles.cronometro}>{formatearTiempo(duracionLlamada)}</Text>
        
        {/* BOTÓN DE COLGAR EN LLAMADA ACTIVA */}
        <TouchableOpacity 
          style={styles.btnColgar}
          onPress={() => {
            setEnLlamada(false);
            setLlamadaEntranteVisible(false);
            if (typeof detenerTono === 'function') detenerTono(); 
          }}
        >
          <MaterialCommunityIcons name="phone-hangup" size={40} color="white" />
        </TouchableOpacity>
      </>
    ) : (
      /* BOTONES DE RESPUESTA (Solo si NO hemos contestado aún) */
      <View style={styles.callActions}>
        
        {/* BOTÓN ACEPTAR (SE CONSERVA ESPECTACULAR CON ICONO NATIVO) */}
        <TouchableOpacity 
          activeOpacity={0.7}
          style={[styles.btnAccept, { 
            backgroundColor: '#25D366', 
            width: 70, 
            height: 70, 
            borderRadius: 35, 
            justifyContent: 'center', 
            alignItems: 'center',
            zIndex: 999,
            elevation: 5
          }]}
          onPress={async () => {
            try {
                console.log("Aceptando llamada...");
                await detenerTono();
                setEnLlamada(true);
                
                // Petición optimizada y sutil de inicio de llamada
                const response = await fetch(`${BASE_URL}/api/chat`, { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        contexto: 'LLAMADA_VOZ',
                        texto: "SISTEMA: Gabriel contestó tu llamada. Salúdalo con amor y emoción." 
                    })
                });
                
                const data = await response.json();
                console.log("Respuesta recibida:", data); 

                if (data && data.respuestaDeDaniela) {
                    await reproducirVozDaniela(data.respuestaDeDaniela);
                } else {
                    console.error("El servidor respondió, pero falta el texto de Daniela.");
                }
            } catch (error) {
                console.error("Error crítico al aceptar la llamada:", error);
            }
          }}
        >
          <MaterialCommunityIcons name="phone" size={35} color="white" />
        </TouchableOpacity>

        {/* BOTÓN DE COLGAR RECHAZAR (EN ESTADO DE ESPERA) */}
        {/* 🚀 CORREGIDO: Reemplazamos 'call-end' por 'phone-hangup' para borrar el signo de (?) para siempre */}
        <TouchableOpacity 
          style={[styles.btnColgar, { backgroundColor: 'red', width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' }]}
          onPress={() => {
            setLlamadaEntranteVisible(false);
            if (typeof detenerTono === 'function') detenerTono();
          }}
        >
          <MaterialCommunityIcons name="phone-hangup" size={35} color="white" />
        </TouchableOpacity>
      </View>
    )}
  </ImageBackground>
</Modal>
 
  {/* MODAL DEL CHAT DE DANIELA */}
<Modal
  animationType="slide"
  transparent={false}
  visible={chatVisible}
  onRequestClose={() => setChatVisible(false)}
>
  {/* 🚀 CONEXIÓN TOTAL: Pasamos la función de voz nativa 'reproducirVozDaniela' 
      para que el chat externo pueda usar los altavoces del teléfono y mandarte audios */}
  <ChatScreen 
    alCerrar={() => setChatVisible(false)} 
    ipServidor={BASE_URL} 
    onReproducirVoz={reproducirVozDaniela} // 👈 ¡ESTE ES EL CABLE QUE FALTABA!
  />
</Modal>

{/* 3. MODAL FOTO COMPLETA (Se queda exactamente igual) */}
<Modal visible={fotoFullVisible} transparent={false}>
  <View style={styles.fullImageContainer}>
    <TouchableOpacity style={styles.backBtn} onPress={() => setFotoFullVisible(false)}>
      <Ionicons name="arrow-back" size={30} color="white" />
    </TouchableOpacity>
    <Image source={profilePic} style={styles.fullImage} resizeMode="contain" />
  </View>
</Modal>

<TouchableOpacity style={styles.fab}>
  <MaterialCommunityIcons name="message-text" size={24} color="white" />
</TouchableOpacity>
</SafeAreaView>
);
}


const styles = StyleSheet.create({
  // 1. BASE Y NAVEGACIÓN (WhatsApp Business)
  safeArea: { flex: 1, backgroundColor: '#075E54' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#075E54' },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },
  icon: { marginRight: 20 },
  tabBar: { flexDirection: 'row', backgroundColor: '#075E54' },
  tabItem: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  tabText: { color: '#B1C9C6', fontWeight: 'bold', fontSize: 14, textTransform: 'uppercase' },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#FFFFFF' },
  tabActiveText: { color: '#FFFFFF', fontWeight: 'bold' },

  // 2. CONTENIDO Y CHATS
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  statusSection: { padding: 15, borderBottomWidth: 0.5, borderBottomColor: '#F3F4F6' },
  statusCircle: { alignItems: 'center', width: 70 },
  statusAvatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#25D366' },
  addBadge: { position: 'absolute', bottom: 20, right: 5, backgroundColor: '#25D366', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },
  statusName: { fontSize: 12, marginTop: 5, color: '#333' },
  chatRow: { flexDirection: 'row', padding: 15, alignItems: 'center' },
  avatar: { width: 55, height: 55, borderRadius: 27.5 },
  chatInfo: { flex: 1, marginLeft: 15, borderBottomWidth: 0.5, borderBottomColor: '#F3F4F6', paddingBottom: 15 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  chatName: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  chatTime: { fontSize: 12, color: '#666' },
  chatMessage: { fontSize: 14, color: '#666', marginTop: 3 },

  // 3. PERFIL DE EMPRESA (MODAL DANIELA)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  businessCard: { width: '95%', height: '85%', backgroundColor: '#fcfcfc', borderRadius: 25, overflow: 'hidden', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10 },
  coverImage: { width: '100%', height: 220, justifyContent: 'flex-end', alignItems: 'center' },
  backButtonModal: { position: 'absolute', top: 20, left: 20 },
  avatarWrapper: { marginBottom: -60 },
  businessAvatar: { width: 130, height: 130, borderRadius: 65, borderWidth: 4, borderColor: 'white' },
  businessDetails: { marginTop: 70, paddingHorizontal: 20, paddingBottom: 30 },
  businessName: { fontSize: 24, fontWeight: 'bold', color: '#000', textAlign: 'center' },
  businessStatus: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 },
  actionBtn: { alignItems: 'center', backgroundColor: '#f0f0f0', padding: 10, borderRadius: 10, width: '30%' },
  actionText: { color: '#075E54', fontSize: 12, marginTop: 5, fontWeight: '500' },
  infoSeparator: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  infoRowText: { marginLeft: 20, fontSize: 16, color: '#333' },
  infoRowTextBold: { marginLeft: 20, fontSize: 16, color: '#000', fontWeight: 'bold' },
  infoRowSubText: { marginLeft: 20, fontSize: 14, color: '#666' },

  // 4. SENSORES Y VISIÓN (Ojos de Daniela)
  cameraContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black', zIndex: 1000 },
  camera: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  cameraControls: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)', padding: 25, width: '100%', justifyContent: 'space-around', alignItems: 'center' },
  captureBtn: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFFFFF', borderWidth: 5, borderColor: '#25D366' },
  thinkingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(7, 94, 84, 0.4)', justifyContent: 'center', alignItems: 'center', zIndex: 1100 },
  thinkingText: { color: '#FFFFFF', marginTop: 10, fontSize: 16, fontWeight: 'bold' },

  // 5. LLAMADA ENTRANTE (Sentimiento Humano)
  callBackground: { flex: 1, width: '100%', height: '100%', justifyContent: 'space-between', backgroundColor: '#075E54' },
  callAvatar: { width: 200, height: 200, borderRadius: 100, borderWidth: 3, borderColor: 'rgba(255, 255, 255, 0.3)', marginTop: 40, alignSelf: 'center' },
  callName: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginTop: 15 },
  callTypeText: { fontSize: 14, color: '#B1C9C6', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2, marginTop: 50 },
  callStatus: { fontSize: 18, color: '#FFFFFF', textAlign: 'center', marginTop: 5 },
  callActions: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 60, width: '100%', backgroundColor: 'rgba(0,0,0,0.2)', paddingTop: 30 },
  btnDecline: { width: 75, height: 75, borderRadius: 37.5, backgroundColor: '#FF3B30', justifyContent: 'center', alignItems: 'center' },
  btnAccept: { width: 75, height: 75, borderRadius: 37.5, backgroundColor: '#25D366', justifyContent: 'center', alignItems: 'center' },

  // 6. UTILIDADES FINALES
  closeBtn: { backgroundColor: '#075E54', padding: 15, alignItems: 'center' },
  fullImageContainer: { flex: 1, backgroundColor: 'black', justifyContent: 'center' },
  fullImage: { width: '100%', height: '80%' },
  backBtn: { position: 'absolute', top: 40, left: 20, zIndex: 10 },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#25D366', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  
  fotoLlamada: {
  width: 200, // Tamaño fijo para que no sea gigante
  height: 200,
  borderRadius: 100, // Círculo perfecto
  alignSelf: 'center',
  marginTop: 50,
  borderWidth: 3,
  borderColor: 'white'
},
modalBackground: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.9)', // Fondo oscuro profesional
  justifyContent: 'center',
  alignItems: 'center'
},

nombreLlamada: {
  fontSize: 22,
  color: 'white', // <-- ¡Esto hará que resalten sobre el fondo oscuro!
  fontWeight: 'bold',
  marginTop: 10,
  textAlign: 'center',
  textShadowColor: 'rgba(0, 0, 0, 0.75)', // Un toque pro para que se lea mejor
  textShadowOffset: {width: 1, height: 1},
  textShadowRadius: 2
},
cronometro: {
  fontSize: 28,
  color: '#00FF00', // Un verde neón que se verá genial sobre el fondo oscuro
  fontWeight: 'bold',
  marginTop: 20,
  textAlign: 'center'
},

// En tu StyleSheet
subtitulo: {
  color: '#FFFFFF', // Blanco puro
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',
  padding: 10,
  backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fondo negro semitransparente para más contraste
  borderRadius: 10,
  textShadowColor: 'rgba(0, 0, 0, 0.75)', // Sombra negra para que no se pierda
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 3,
  marginHorizontal: 20,
},

headerContent: {
  flexDirection: 'row', // Esto pone el nombre al lado de la imagen
  alignItems: 'center', 
  justifyContent: 'flex-start',
},
headerName: {
  marginLeft: 10, // Separación entre la foto y el nombre
  fontWeight: 'bold',
  fontSize: 16,
},


});





