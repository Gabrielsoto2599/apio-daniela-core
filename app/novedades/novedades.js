// ====================================================================
// BLOQUE 0: IMPORTACIONES DE CONFIGURACIÓN Y ASSETS (ESTADOS 2026)
// ====================================================================
import { useState } from 'react';
import { 
  StyleSheet, View, Text, StatusBar, SafeAreaView, 
  TouchableOpacity, Image, ScrollView, FlatList 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import fotoGabriel from '../../apio-app/assets/images/foto-perfil-gabriel.png';
import fotoDaniela from '../../apio-app/assets/images/foto-perfil-apio.png';

export default function Novedades({ onVolver, onAbrirEmpresa }) {
  // ====================================================================
  // BLOQUE 1: ESTADOS REALES (HISTORIAL DE ESTADOS DINÁMICOS - INICIA VACÍO)
  // ====================================================================
  // Al iniciar como un array vacío, no habrá estados estáticos colgados de Daniela
  const [estadosDaniela, setEstadosDaniela] = useState([]);

  // ====================================================================
  // BLOQUE 2: COMPONENTES DE RENDERIZADO DINÁMICO (FILAS DE ESTADOS)
  // ====================================================================
  const renderFilaEstadoIA = ({ item }) => (
    <TouchableOpacity style={styles.stateRow}>
      {/* El anillo verde se pintará de forma dinámica según el flag 'visto' */}
      <View style={[styles.avatarRing, !item.visto && styles.ringVerdeUnread]}>
        <Image source={fotoDaniela} style={styles.statusAvatarImage} />
      </View>
      <View style={styles.statusTextDetails}>
        <Text style={styles.statusName}>{item.nombre}</Text>
        <Text style={styles.statusTime}>{item.hora}</Text>
      </View>
    </TouchableOpacity>
  );

  // ====================================================================
  // BLOQUE 3: INTERFAZ GRÁFICA PRINCIPAL (RETORNO DE UI - LÓGICA PASIVA)
  // ====================================================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#111b21" barStyle="light-content" />

      {/* 3.1 HEADER SUPERIOR GENERAL DE WHATSAPP MODO OSCURO */}
      <View style={styles.topBarHeader}>
        <Text style={styles.brandTitle}>Apio</Text>
        <View style={styles.headerIconsRow}>
          <TouchableOpacity style={styles.actionIconBtn}>
            <Ionicons name="camera-outline" size={23} color="#aebac1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIconBtn}>
            <Ionicons name="search-outline" size={21} color="#aebac1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIconBtn} onPress={onAbrirEmpresa}>
            <MaterialCommunityIcons name="dots-vertical" size={23} color="#aebac1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 3.2 TABS DE NAVEGACIÓN FUNCIONALES EN ESPAÑOL */}
      <View style={styles.tabsBarContainer}>
        <TouchableOpacity style={styles.tabItemBtn} onPress={() => onVolver('home')}>
          <Text style={styles.tabItemText}>Chats</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tabItemBtn, styles.tabItemBtnActive]}>
          <Text style={[styles.tabItemText, styles.tabItemTextActive]}>Novedades</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItemBtn} onPress={() => onVolver('llamadas')}>
          <Text style={styles.tabItemText}>Llamadas</Text>
        </TouchableOpacity>
      </View>

      {/* 3.3 CUERPO SCROLLABLE DE LOS ESTADOS DEL ECOSYSTEMA */}
      <ScrollView style={styles.mainContentBody} contentContainerStyle={styles.scrollPadding}>
        
        {/* TÍTULO PRINCIPAL DE LA PESTAÑA */}
        <Text style={styles.sectionTitle}>Estados</Text>

        {/* 🚀 MI CIRCULO DE ESTADO (GABRIEL - SIEMPRE DISPONIBLE PARA SUBIR) */}
        <View style={styles.myStatusContainer}>
          <View style={styles.myAvatarWrapper}>
            <Image source={fotoGabriel} style={styles.myAvatarImage} />
            {/* El botón de suma azul característico de WhatsApp para subir estados */}
            <View style={styles.addStatusBadge}>
              <Ionicons name="add" size={16} color="#fff" />
            </View>
          </View>
          <View style={styles.statusTextDetails}>
            <Text style={styles.statusName}>Mi estado</Text>
            <Text style={styles.statusTime}>Añade una actualización</Text>
          </View>
        </View>

        {/* CONDICIONAL: Solo si el array tiene datos se pinta la lista y el separador */}
        {estadosDaniela.length > 0 && (
          <View>
            <Text style={styles.subSectionTitle}>Recientes</Text>
            <FlatList 
              data={estadosDaniela}
              keyExtractor={(item) => item.id}
              renderItem={renderFilaEstadoIA}
              scrollEnabled={false} // El ScrollView global maneja la bajada física
            />
          </View>
        )}

      </ScrollView>

      {/* 3.4 BOTONES FLOTANTES DE EDICIÓN NATIVOS DE WHATSAPP (LÁPIZ Y CÁMARA) */}
      <View style={styles.fabContainerRow}>
        <TouchableOpacity style={styles.floatingActionPenButton}>
          <MaterialCommunityIcons name="pencil" size={20} color="#e9edef" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatingActionButton}>
          <Ionicons name="camera" size={22} color="#111b21" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
} // ⬅️ Fin Limpio y Cerrado del Componente Novedades
// ====================================================================
// BLOQUE 5: DISEÑO Y ESTILOS DE INTERFAZ (ESTADOS REALES WHATSAPP 2026)
// ====================================================================
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#111b21' },
  
  // Header Superior General
  topBarHeader: { height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#111b21' },
  brandTitle: { fontSize: 21, fontWeight: '700', color: '#8696a0', letterSpacing: 0.5 },
  headerIconsRow: { flexDirection: 'row', alignItems: 'center' },
  actionIconBtn: { marginLeft: 22 },
  
  // Barra de Pestañas (Navegación)
  tabsBarContainer: { flexDirection: 'row', height: 46, backgroundColor: '#111b21' },
  tabItemBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabItemBtnActive: { borderBottomColor: '#00a884' },
  tabItemText: { fontSize: 15, fontWeight: '700', color: '#8696a0' },
  tabItemTextActive: { color: '#00a884' },

  // Cuerpo de la pestaña Novedades
  mainContentBody: { flex: 1, backgroundColor: '#0b141a' },
  scrollPadding: { paddingVertical: 16, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 19, fontWeight: '700', color: '#e9edef', marginBottom: 20 },
  subSectionTitle: { fontSize: 14, fontWeight: '600', color: '#8696a0', marginTop: 10, marginBottom: 12 },
  
  // Contenedor General del Estado de Gabriel (Mi Estado)
  myStatusContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  myAvatarWrapper: { position: 'relative', width: 52, height: 52 },
  myAvatarImage: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#202c33' },
  
  // El característico botón "+" azul de WhatsApp sobre el avatar de Gabriel
  addStatusBadge: { 
    position: 'absolute', 
    bottom: -1, 
    right: -1, 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    backgroundColor: '#00a884', // Verde oficial moderno
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0b141a' // Match con el fondo de la pantalla para efecto de recorte
  },

  // Contenedor de las filas de Daniela cuando tenga autonomía
  stateRow: { flexDirection: 'row', paddingVertical: 10, alignItems: 'center' },
  avatarRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2
  },
  ringVerdeUnread: { borderColor: '#00a884' }, // Anillo verde reactivo de estado no visto
  statusAvatarImage: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#202c33' },
  
  // Detalles del texto
  statusTextDetails: { marginLeft: 16, justifyContent: 'center' },
  statusName: { fontSize: 16, fontWeight: '700', color: '#e9edef' },
  statusTime: { fontSize: 14, color: '#8696a0', marginTop: 2 },

  // Botones Flotantes en la esquina inferior derecha (Pila clásica de WhatsApp)
  fabContainerRow: { position: 'absolute', bottom: 20, right: 20, alignItems: 'center' },
  floatingActionPenButton: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: '#202c33', // El botón del lápiz es gris oscuro en WhatsApp
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22
  },
  floatingActionButton: { 
    width: 54, 
    height: 54, 
    borderRadius: 27, 
    backgroundColor: '#00a884', // Botón principal de la cámara
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  }
});

