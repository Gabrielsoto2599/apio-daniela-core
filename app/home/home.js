// ====================================================================
// BLOQUE 0: IMPORTACIONES DE CONFIGURACIÓN Y ASSETS (SOTO SYSTEM 2026)
// Ubicación: app/home/home.js (Versión Homologada Multiusuario)
// ====================================================================
import { useState } from 'react';
import { 
  StyleSheet, View, Text, StatusBar, SafeAreaView, 
  TouchableOpacity, Image, FlatList, Modal 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// 🚀 IMPORTACIÓN CRÍTICA INYECTADA: Conectamos tu modal de la cámara QR local
import VincularDispositivoModal from './vincular';

// 🚀 RUTA SINCROINZADA: Formato .png real mapeado de tu Explorador de Windows
import profilePic from '../../apio-app/assets/images/foto-perfil-apio.png';

// 🚀 CABECERA REFACTORIZADA MULTIUSUARIO: 
// Recibe de forma obligatoria 'usuarioLogueado' desde el orquestador App.js
export default function Home({ messages, usuarioLogueado, onCambiarVista, onAbrirPerfil, onAbrirEmpresa }) {

  // ====================================================================
  // BLOQUE 1: ESTADOS LOCALES DE INTERFAZ Y NAVEGACIÓN EN TIEMPO REAL
  // ====================================================================
  const [pestanaActiva, setPestanaActiva] = useState('chats'); // 'chats', 'novedades', 'llamadas'
  const [modalFotoVisible, setModalFotoVisible] = useState(false); // Controla el menú de la elipse
  
  // 🚀 NUEVO ESTADO DE RED: Controla el encendido de la cámara de expo en vincular.js
  const [modalQRVisible, setModalQRVisible] = useState(false);

  // 🧠 FILTRO VIVO: Extraemos de forma matemática el último mensaje real sin bloqueos de referencia
  const obtenerUltimoMensajeVivo = () => {
    if (!messages || messages.length === 0) {
      return "Toca para iniciar conversación..."; 
    }
    const ultimoMsg = messages[messages.length - 1];
    return ultimoMsg.texto || ultimoMsg.text || "..."; 
  };

  const obtenerHoraUltimoMensaje = () => {
    if (!messages || messages.length === 0) return "";
    const ultimoMsg = messages[messages.length - 1];
    return ultimoMsg.time || "";
  };

  // Mapeo oficial dinámico - Sincronizado en tiempo real con el App.js móvil
  const listaChats = [
    {
      id: 'daniela_ia',
      nombre: 'Daniela',
      ultimoMensaje: obtenerUltimoMensajeVivo(), // 🚀 ENLAZADO CON EL ENTORNO SIN CRASHES
      hora: obtenerHoraUltimoMensaje(),
      noLeidos: 0, 
    }
  ];

   // ====================================================================
// BLOQUE 2: COMPONENTES DE RENDERIZADO INTERNOS (FILAS DE CHAT)
// Ubicación: app/home/home.js (Versión Integrada y Homologada)
// ====================================================================
const renderFilaChat = ({ item }) => (
  <TouchableOpacity style={styles.chatRow} onPress={() => onCambiarVista('chat')}>
    
    {/* 🚀 AVATAR INTELIGENTE: Al tocar la foto pequeña del chat, abre la sección Business */}
    <TouchableOpacity 
      style={styles.avatarTouch} 
      onPress={() => item.id === 'daniela_ia' ? onAbrirEmpresa() : null}
    >
      <Image source={profilePic} style={styles.avatarImage} />
      {item.id === 'daniela_ia' && <View style={styles.onlineIndicator} />}
    </TouchableOpacity>

    <View style={styles.chatDetails}>
      <View style={styles.chatHeaderInfo}>
        <Text style={styles.chatName}>{item.nombre}</Text>
        <Text style={styles.chatTime}>{obtenerHoraUltimoMensaje()}</Text>
      </View>
      <View style={styles.chatMessageInfo}>
        <Text style={styles.chatSubtext} numberOfLines={1}>
          {obtenerUltimoMensajeVivo()}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

// ====================================================================
// BLOQUE 3: INTERFAZ GRÁFICA PRINCIPAL (RETORNO DE UI)
// ====================================================================
return (
  <SafeAreaView style={styles.safeArea}>
    <StatusBar backgroundColor="#111b21" barStyle="light-content" />

    {/* 3.1 ENCABEZADO SUPERIOR DE LA APLICACIÓN (BRAND & ACCIONES) */}
    <View style={styles.topBarHeader}>
      <Text style={styles.brandTitle}>Apio</Text>
      <View style={styles.headerIconsRow}>
        <TouchableOpacity style={styles.actionIconBtn}>
          <Ionicons name="camera-outline" size={23} color="#aebac1" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionIconBtn}>
          <Ionicons name="search-outline" size={21} color="#aebac1" />
        </TouchableOpacity>
        
        {/* 🚀 GATILLO DEL MENÚ DE RED DETONADO: Abre las opciones del sistema flotantes */}
        <TouchableOpacity 
          style={styles.actionIconBtn} 
          onPress={() => setModalFotoVisible(true)}
        >
          <MaterialCommunityIcons name="dots-vertical" size={23} color="#aebac1" />
        </TouchableOpacity>
      </View>
    </View>

    {/* 3.2 SELECTOR DE PESTAÑAS TRADICIONALES EN ESPAÑOL */}
    <View style={styles.tabsBarContainer}>
      <TouchableOpacity 
        style={[styles.tabItemBtn, pestanaActiva === 'chats' && styles.tabItemBtnActive]} 
        onPress={() => setPestanaActiva('chats')}
      >
        <Text style={[styles.tabItemText, pestanaActiva === 'chats' && styles.tabItemTextActive]}>
          Chats
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tabItemBtn, pestanaActiva === 'novedades' && styles.tabItemBtnActive]} 
        onPress={() => onCambiarVista('novedades')}
      >
        <Text style={[styles.tabItemText, pestanaActiva === 'novedades' && styles.tabItemTextActive]}>
          Novedades
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tabItemBtn, pestanaActiva === 'llamadas' && styles.tabItemBtnActive]} 
        onPress={() => onCambiarVista('llamadas')}
      >
        <Text style={[styles.tabItemText, pestanaActiva === 'llamadas' && styles.tabItemTextActive]}>
          Llamadas
        </Text>
      </TouchableOpacity>
    </View>

    {/* 3.3 CUERPO DE CONTENIDO PRINCIPAL (LISTA DE CONVERSACIONES) */}
    <View style={styles.mainContentBody}>
      {pestanaActiva === 'chats' && (
        <FlatList 
          data={listaChats}
          keyExtractor={(item) => item.id}
          renderItem={renderFilaChat}
          contentContainerStyle={styles.flatListPadding}
        />
      )}
    </View>

    {/* 3.4 BOTÓN FLOTANTE DE ACCIÓN DIRECTA (FAB) */}
    {pestanaActiva === 'chats' && (
      <TouchableOpacity style={styles.floatingActionButton} onPress={() => onCambiarVista('chat')}>
        <MaterialCommunityIcons name="message-text" size={23} color="#111b21" />
      </TouchableOpacity>
    )}

    {/* ====================================================================
      🚀 BLOQUE 4 TRANSFORMADO: MENÚ FLOTANTE + CÁMARA QR INYECTADA (REGLA DE GABRIEL)
      ==================================================================== */}
    
    {/* 1. EL MENÚ DE OPCIONES QUE ABRE LA ELIPSE */}
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalFotoVisible}
      onRequestClose={() => setModalFotoVisible(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlayBackground} 
        activeOpacity={1} 
        onPress={() => setModalFotoVisible(false)} 
      >
        <View style={styles.profileModalBox} onStartShouldSetResponder={() => true}>
          
          <View style={{ backgroundColor: '#202c33', padding: 14, borderBottomWidth: 1, borderBottomColor: '#2a3942' }}>
            <Text style={{ color: '#e9edef', fontSize: 16, fontWeight: '700' }}>Opciones del Sistema</Text>
          </View>

                  {/* 🔗 AL TOCAR ESTA OPCIÓN VERDE: Apaga el menú flotante y enciende la cámara nativa de Expo */}
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#111b21' }}
            activeOpacity={0.7}
            onPress={() => {
              setModalFotoVisible(false); // Cerramos el menú de la elipse
              setModalQRVisible(true);    // 🚀 LE METEMOS CORRIENTE A LA CÁMARA DE VINCULAR.JS
            }}
          >
            {/* 🚀 CORREGIDO: Removida la comilla doble huérfana del size */}
            <Ionicons name="qr-code-outline" size={22} color="#00a884" style={{ marginRight: 14 }} />
            <Text style={{ color: '#e9edef', fontSize: 15, fontWeight: '600' }}>Vincular dispositivo (QR)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#111b21', borderTopWidth: 1, borderTopColor: '#2a3942' }}
            activeOpacity={0.7}
            onPress={() => {
              setModalFotoVisible(false);
              onAbrirEmpresa(); 
            }}
          >
            <Ionicons name="business-outline" size={22} color="#8696a0" style={{ marginRight: 14 }} />
            <Text style={{ color: '#e9edef', fontSize: 15 }}>Perfil de la Empresa</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>

    {/* 2. 📸 EL ESCÁNER DE VINCULAR.JS ANCLADO COMO HIJO DIRECTO EN EL RENDER */}
    <VincularDispositivoModal 
      isOpen={modalQRVisible} 
      onClose={() => setModalQRVisible(false)} 
      
      // 🚀 ENCENDIDO EN TIEMPO REAL: Le inyectamos la prop de identidad persistente que hereda de App.js
      usuarioActual={usuarioLogueado} 

      onVinculacionExitosa={(urlEscaneada) => {
        console.log(`✅ [SOTO QR]: Sincronización exitosa detectada para el operador: [${usuarioLogueado}]`);
        
        try {
          // Convertimos dinámicamente el protocolo HTTPS al protocolo WebSocket seguro WSS
          const urlWebSocket = urlEscaneada.replace('https://', 'wss://').replace('http://', 'ws://');
          
          // Levantamos la antena de red desde el teléfono hacia tu contenedor de Railway
          const wsMovil = new WebSocket(urlWebSocket);
          
          wsMovil.onopen = () => {
            const payload = {
              evento: "VINCULACION_EXITOSA",
              user_id: usuarioLogueado // Le transmite el operador real (Gabriel, Rosmary, etc.) a Django
            };
            
            // Escupimos los bytes binarios por el aire hacia Django Channels
            wsMovil.send(JSON.stringify(payload));
            console.log(`📡 [SOTO LINK SUCCESS]: Señal operativa transmitida a Django con firma multiusuario.`);
            
            // Liberamos el sensor tras 1.5s para no dejar conexiones muertas colgadas
            setTimeout(() => { wsMovil.close(); }, 1500);
          };

          wsMovil.onerror = (error) => {
            console.error("❌ [SOTO MOBILE NET ERROR]: Falló la inyección al WebSocket:", error);
          };

        } catch (netError) {
          console.error("❌ [SOTO CRITICAL NET CRASH]:", netError.message);
        }
      }}
    />

  </SafeAreaView> 
);
} // ⬅️ LLAVE DE CIERRE ÚNICA DE TU COMPONENTE MAESTRO HOME

// ====================================================================
// BLOQUE 5: DISEÑO Y ESTILOS DE INTERFAZ (WHATSAPP PLUS MODERNO PREMIUM)
// Ubicación: app/home/home.js (Paleta de Colores Certificada 2026)
// ====================================================================
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0b141a' }, // Fondo profundo ultra-dark de WhatsApp Plus
  
  // Estilos del encabezado superior (Brand & Acciones)
  topBarHeader: { height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#111b21' },
  
  // 🚀 REPARACIÓN PREMIUM: Título Apio revitalizado con Verde Neón Esmeralda de alto brillo
  brandTitle: { fontSize: 22, fontWeight: '800', color: '#00E676', letterSpacing: 0.8, fontFamily: 'System' },
  headerIconsRow: { flexDirection: 'row', alignItems: 'center' },
  actionIconBtn: { marginLeft: 22 },
  
  // Estilos de la barra de pestañas (Navegación Fluida Plus)
  tabsBarContainer: { flexDirection: 'row', height: 46, backgroundColor: '#111b21', borderBottomWidth: 1, borderBottomColor: '#202c33' },
  tabItemBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabItemBtnActive: { borderBottomColor: '#00a884' }, // Línea inferior Verde Neón Plus
  tabItemText: { fontSize: 15, fontWeight: '700', color: '#8696a0', fontFamily: 'System' },
  tabItemTextActive: { color: '#00a884', fontWeight: '800' },

  // Estilos del cuerpo de la lista de conversaciones
  mainContentBody: { flex: 1, backgroundColor: '#0b141a' },
  flatListPadding: { paddingTop: 8 },
  chatRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#1e2b34' },
  
  // Avatares e Indicadores de Sincronización en Mostrador
  avatarTouch: { position: 'relative' },
  avatarImage: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#202c33', borderWidth: 1, borderColor: '#2a3942' },
  onlineIndicator: { position: 'absolute', bottom: 1, right: 1, width: 14, height: 12, borderRadius: 7, backgroundColor: '#00a884', borderWidth: 2, borderColor: '#0b141a' },
  
  // Textos y nombres en las filas de chat
  chatDetails: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  chatHeaderInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  chatName: { fontSize: 16, fontWeight: '700', color: '#e9edef', fontFamily: 'System' },
  chatTime: { fontSize: 12, color: '#00a884', fontWeight: '600' }, // Tiempo resaltado en verde Plus
  chatMessageInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatSubtext: { fontSize: 14, color: '#8696a0', flex: 0.92, fontFamily: 'System' },
  
  // Resaltado Premium para mensajes no leídos y contadores
  textVerdeHighlight: { color: '#00a884', fontWeight: '700' },
  badgeNotificacion: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#00a884', justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#111b21', fontSize: 11, fontWeight: '800', fontFamily: 'System' },

  // Botón flotante FAB (Estilo Eléctrico WhatsApp Plus)
  floatingActionButton: { 
    position: 'absolute', 
    bottom: 24, 
    right: 20, 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    backgroundColor: '#00a884', 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 6, 
    shadowColor: '#00a884', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.35, 
    shadowRadius: 4.65 
  },

  // Estilos del Menú de Opciones Elipse Flotante (Hardware & SaaS)
  modalOverlayBackground: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.55)', justifyContent: 'center', alignItems: 'center' },
  profileModalBox: { width: 260, backgroundColor: '#111b21', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#202c33', elevation: 12 },
  modalHeaderNameBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 40, backgroundColor: 'rgba(17, 27, 33, 0.6)', paddingHorizontal: 12, justifyContent: 'center', zIndex: 1 },
  modalProfileName: { color: '#e9edef', fontSize: 15, fontWeight: '600', fontFamily: 'System' },
  modalFullImage: { width: 260, height: 260, resizeMode: 'cover' },
  modalActionsFooter: { height: 48, flexDirection: 'row', backgroundColor: '#111b21', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#202c33' },
  modalFooterIcon: { padding: 8 }
});
