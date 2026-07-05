// ====================================================================
// BLOQUE 0: IMPORTACIONES DE CONFIGURACIÓN Y ASSETS (LLAMADAS 2026)
// ====================================================================
import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, StatusBar, SafeAreaView, 
  TouchableOpacity, Image, FlatList 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Importación del asset de imagen de Daniela simplificado
import fotoDaniela from '../../apio-app/assets/images/foto-perfil-apio.png';

export default function Llamadas({ onVolver, onAbrirEmpresa }) {
  // ====================================================================
  // BLOQUE 1: ESTADOS REALES (HISTORIAL DE LLAMADAS DINÁMICAS - INICIA VACÍO)
  // ====================================================================
  // Nace vacío tal como acordamos. Se poblará cuando se registren llamadas reales.
  const [historialLlamadas, setHistorialLlamadas] = useState([]);

  // ====================================================================
  // BLOQUE 2: COMPONENTES DE RENDERIZADO DINÁMICO (FILAS DE LLAMADAS)
  // ====================================================================
  const renderFilaLlamada = ({ item }) => (
    <TouchableOpacity style={styles.callRow}>
      <Image source={fotoDaniela} style={styles.callAvatarImage} />
      
      <View style={styles.callTextDetails}>
        <Text style={styles.callName}>{item.nombre}</Text>
        <View style={styles.callStatusRow}>
          {/* Icono dinámico: flecha entrante, saliente o perdida */}
          <Ionicons 
            name={item.entrante ? "arrow-down-left" : "arrow-up-right"} 
            size={16} 
            color={item.perdida ? "#ef5350" : "#00a884"} 
            style={{ marginRight: 5 }}
          />
          <Text style={styles.callTime}>{item.hora}</Text>
        </View>
      </View>

      {/* Icono a la derecha: Teléfono o Video según el tipo de llamada */}
      <TouchableOpacity style={styles.callActionIconBtn}>
        <Ionicons 
          name={item.esVideo ? "videocam" : "call"} 
          size={22} 
          color="#00a884" 
        />
      </TouchableOpacity>
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

        <TouchableOpacity style={styles.tabItemBtn} onPress={() => onVolver('novedades')}>
          <Text style={styles.tabItemText}>Novedades</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tabItemBtn, styles.tabItemBtnActive]}>
          <Text style={[styles.tabItemText, styles.tabItemTextActive]}>Llamadas</Text>
        </TouchableOpacity>
      </View>

      {/* 3.3 CUERPO DE LA INTERFAZ CONDICIONAL O SCROLLABLE */}
      <View style={styles.mainContentBody}>
        {historialLlamadas.length === 0 ? (
          /* 🚀 RESPUESTA PASIVA: Muestra un mensaje limpio cuando el historial está en blanco */
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No hay llamadas recientes</Text>
            <Text style={styles.emptySubtext}>Las llamadas de soporte técnico o personales con Daniela aparecerán aquí de forma automática.</Text>
          </View>
        ) : (
          <FlatList 
            data={historialLlamadas}
            keyExtractor={(item) => item.id}
            renderItem={renderFilaLlamada}
            contentContainerStyle={styles.flatListPadding}
          />
        )}
      </View>

      {/* 3.4 BOTÓN FLOTANTE CLÁSICO DE WHATSAPP PARA LLAMAR */}
      <TouchableOpacity style={styles.floatingActionButton}>
        <MaterialCommunityIcons name="phone-plus" size={22} color="#111b21" />
      </TouchableOpacity>

    </SafeAreaView>
  );
} // ⬅=== FIN DE LA FUNCIÓN LLAMADAS

// ====================================================================
// BLOQUE 5: DISEÑO Y ESTILOS DE INTERFAZ (LLAMADAS REALES WHATSAPP 2026)
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

  // Cuerpo de la pestaña Llamadas
  mainContentBody: { flex: 1, backgroundColor: '#0b141a' },
  flatListPadding: { paddingTop: 8 },
  
  // Contenedor de Historial Vacío (Estético)
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#e9edef', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#8696a0', textAlign: 'center', lineHeight: 20 },

  // Estilos de la fila de llamada activa
  callRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' },
  callAvatarImage: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#202c33' },
  callTextDetails: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  callName: { fontSize: 16, fontWeight: '700', color: '#e9edef' },
  callStatusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  callTime: { fontSize: 14, color: '#8696a0' },
  callActionIconBtn: { padding: 8, marginLeft: 10 },

  // Botón flotante FAB (Estilo añadir llamada)
  floatingActionButton: { position: 'absolute', bottom: 20, right: 20, width: 54, height: 54, borderRadius: 27, backgroundColor: '#00a884', justifyContent: 'center', alignItems: 'center', elevation: 4 }
});

