// ====================================================================
// BLOQUE 0: IMPORTACIONES DE CONFIGURACIÓN Y ASSETS (SOTO SYSTEM 2026)
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

// 🚀 CABECERA REFACTORIZADA: Recibe de forma desestructurada el estado vivo de los mensajes
export default function Home({ messages, onCambiarVista, onAbrirPerfil, onAbrirEmpresa }) {

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
  🚀 BLOQUE 4 TRANSFORMADO: MENU FLOTANTE + CAMARA QR INYECTADA (REGLA DE GABRIEL)
  ==================================================================== */}
  
  {/* 1. EL MENU DE OPCIONES QUE ABRE LA ELIPSE */}
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

        {/* 🔗 AL TOCAR ESTA OPCION VERDE: Apaga el menu flotante y enciende la camara nativa de Expo */}
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#111b21' }}
          activeOpacity={0.7}
          onPress={() => {
            setModalFotoVisible(false); // Cerramos el menu de la elipse
            setModalQRVisible(true);    // 🚀 LE METEMOS CORRIENTE A LA CAMARA WEB DE VINCULAR.JS
          }}
        >
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

  {/* 2. 📸 EL ESCANER DE VINCULAR.JS ANCLADO COMO HIJO DIRECTO EN EL RENDER */}
  <VincularDispositivoModal 
    isOpen={modalQRVisible} 
    onClose={() => setModalQRVisible(false)} 
    onVinculacionExitosa={(data) => {
      console.log("✅ [SOTO QR]: Sincronización exitosa con el mostrador de Apio:", data);
    }}
  />

    </SafeAreaView> 
  );
} // ⬅️ LLAVE DE CIERRE UNICA DE TU COMPONENTE MAESTRO HOME

// ====================================================================
// BLOQUE 5: DISEÑO Y ESTILOS DE INTERFAZ (WHATSAPP MODO OSCURO MODERNO)
// ====================================================================
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#111b21' },
  
  // Estilos del encabezado superior
  topBarHeader: { height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#111b21' },
  brandTitle: { fontSize: 21, fontWeight: '700', color: '#8696a0', letterSpacing: 0.5 },
  headerIconsRow: { flexDirection: 'row', alignItems: 'center' },
  actionIconBtn: { marginLeft: 22 },
  
  // Estilos de la barra de pestañas (Navegación)
  tabsBarContainer: { flexDirection: 'row', height: 46, backgroundColor: '#111b21' },
  tabItemBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabItemBtnActive: { borderBottomColor: '#00a884' },
  tabItemText: { fontSize: 15, fontWeight: '700', color: '#8696a0' },
  tabItemTextActive: { color: '#00a884' },

  // Estilos del cuerpo de la lista de conversaciones
  mainContentBody: { flex: 1, backgroundColor: '#0b141a' },
  flatListPadding: { paddingTop: 8 },
  chatRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 11, alignItems: 'center' },
  
  // Avatares de la lista
  avatarTouch: { position: 'relative' },
  avatarImage: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#202c33' },
  onlineIndicator: { position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: 6, backgroundColor: '#00a884', borderWidth: 2, borderColor: '#0b141a' },
  
  // Textos y nombres en las filas de chat
  chatDetails: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  chatHeaderInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  chatName: { fontSize: 16, fontWeight: '700', color: '#e9edef' },
  chatTime: { fontSize: 12, color: '#8696a0' },
  chatMessageInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatSubtext: { fontSize: 14, color: '#8696a0', flex: 0.92 },
  
  // Resaltado verde para mensajes no leídos
  textVerdeHighlight: { color: '#00a884', fontWeight: '600' },
  badgeNotificacion: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#00a884', justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#111b21', fontSize: 11, fontWeight: '700' },

  // Botón flotante FAB (Estilo WhatsApp clásico)
  floatingActionButton: { position: 'absolute', bottom: 20, right: 20, width: 54, height: 54, borderRadius: 27, backgroundColor: '#00a884', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },

  // Estilos del Modal emergente de Foto de Perfil Rápido
  modalOverlayBackground: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.65)', justifyContent: 'center', alignItems: 'center' },
  profileModalBox: { width: 250, backgroundColor: '#111b21', borderRadius: 4, overflow: 'hidden', elevation: 10 },
  modalHeaderNameBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 40, backgroundColor: 'rgba(17, 27, 33, 0.4)', paddingHorizontal: 12, justifyContent: 'center', zIndex: 1 },
  modalProfileName: { color: '#e9edef', fontSize: 15, fontWeight: '600' },
  modalFullImage: { width: 250, height: 250, resizeMode: 'cover' },
  modalActionsFooter: { height: 46, flexDirection: 'row', backgroundColor: '#111b21', justifyContent: 'space-around', alignItems: 'center' },
  modalFooterIcon: { padding: 8 }
});
