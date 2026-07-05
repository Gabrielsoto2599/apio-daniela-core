// ====================================================================
// BLOQUE 0: IMPORTACIONES DE CONFIGURACIÓN Y ASSETS (BUSINESS SAAS 2026)
// ====================================================================
import { 
  StyleSheet, View, Text, Modal, TouchableOpacity, 
  Image, ScrollView, ImageBackground, StatusBar, SafeAreaView 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

// Importación de tus assets nativos en formato .jpg tal como acordamos
import backgroundPic from '../../apio-app/assets/images/foto-fondo-apio.png';
import profilePic from '../../apio-app/assets/images/foto-perfil-apio.png';

export default function Bussnes({ isOpen, onClose }) {
  
  // ====================================================================
  // BLOQUE 1: CONFIGURACIÓN DE IDENTIDAD Y NARRATIVA CORPORATIVA DUAL
  // ====================================================================
  const datosEmpresa = {
    nombre: "Daniela",
    firma: "~Daniela Rincon",
    categoria: "Arte y entretenimiento",
    ubicacion: "Barquisimeto, Estado Lara",
    correo: "dare1807@gmail.com",
    descripcion: "Estudiante de pintura y Jefa del Departamento de Arte y Diseño de Soto System Digital Solution VE. Gerente y Encargada operativa del Sistema Apio Ecommerce."
  };

  // ====================================================================
  // BLOQUE 3: INTERFAZ GRÁFICA PRINCIPAL (RETORNO DE UI DEL MODAL)
  // ====================================================================
  return (
    <Modal visible={isOpen} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.businessCard}>
          <StatusBar backgroundColor="#202c33" barStyle="light-content" />
          
          {/* 3.1 PORTADA CON BANNER DE FONDO Y AVATAR SUPERPUESTO */}
          <ImageBackground source={backgroundPic} style={styles.coverImage}>
            <TouchableOpacity style={styles.backButtonModal} onPress={onClose}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.avatarWrapper}>
              <Image source={profilePic} style={styles.businessAvatar} />
            </View>
          </ImageBackground>

          {/* 3.2 CUERPO SCROLLABLE DE DETALLES DEL PERFIL COMERCIAL */}
          <ScrollView contentContainerStyle={styles.businessDetails}>
            
            {/* IDENTIDAD DE DANIELA */}
            <Text style={styles.businessName}>{datosEmpresa.nombre}</Text>
            <Text style={styles.businessStatus}>{datosEmpresa.firma}</Text>
    
            {/* ACCIONES RÁPIDAS DE WHATSAPP BUSINESS */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="call-outline" size={22} color="#00a884" />
                <Text style={styles.actionText}>Llamar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <MaterialCommunityIcons name="storefront-outline" size={22} color="#00a884" />
                <Text style={styles.actionText}>Catálogo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="share-social-outline" size={22} color="#00a884" />
                <Text style={styles.actionText}>Compartir</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoSeparator} />

            {/* DESCRIPCIÓN REFORZADA (NUEVA HOJA DE LOGÍSTICA) */}
            <View style={styles.infoRowDescription}>
              <Text style={styles.descriptionText}>{datosEmpresa.descripcion}</Text>
            </View>

            <View style={styles.infoSeparator} />

            {/* CATEGORÍA */}
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="palette-swatch-outline" size={22} color="#8696a0" />
              <Text style={styles.infoRowText}>{datosEmpresa.categoria}</Text>
            </View>

            {/* UBICACIÓN */}
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={22} color="#8696a0" />
              <Text style={styles.infoRowText}>{datosEmpresa.ubicacion}</Text>
            </View>

            {/* CORREO */}
            <View style={styles.infoRow}>
              <MaterialIcons name="mail-outline" size={22} color="#8696a0" />
              <Text style={styles.infoRowText}>{datosEmpresa.correo}</Text>
            </View>

            {/* INFO DE CUENTA DE EMPRESA B2B */}
            <View style={styles.infoRow}>
              <Ionicons name="information-circle-outline" size={22} color="#8696a0" />
              <View style={styles.textContainerColumn}>
                <Text style={styles.infoRowTextBold}>Cuenta de empresa</Text>
                <Text style={styles.infoRowSubText}>Esta cuenta usa Apio Business de forma automatizada.</Text>
              </View>
            </View>
          </ScrollView>

          {/* BOTÓN INFERIOR DE RETORNO AL HOME */}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={{ color: 'white', fontWeight: 'bold', letterSpacing: 0.5 }}>VOLVER</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

// ====================================================================
// BLOQUE 5: DISEÑO Y ESTILOS COSMÉTICOS (MODO OSCURO COMPATIBLE)
// ====================================================================
const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'center', alignItems: 'center' },
  businessCard: { width: '100%', height: '100%', backgroundColor: '#0b141a' },
  
  // Portada y Avatar superpuesto
  coverImage: { width: '100%', height: 180, position: 'relative' },
  backButtonModal: { position: 'absolute', top: 16, left: 16, padding: 6, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20 },
  avatarWrapper: { position: 'absolute', bottom: -45, left: 20, width: 90, height: 90, borderRadius: 45, backgroundColor: '#0b141a', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  businessAvatar: { width: 82, height: 82, borderRadius: 41, backgroundColor: '#202c33' },
  
  // Detalles e Identidad
  businessDetails: { paddingHorizontal: 16, paddingTop: 60, paddingBottom: 24 },
  businessName: { fontSize: 22, fontWeight: '700', color: '#e9edef' },
  businessStatus: { fontSize: 14, color: '#8696a0', marginTop: 2, fontStyle: 'italic' },
  
  // Botones de acción rápidos (Estilo WhatsApp Business)
  actionButtons: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  actionBtn: { alignItems: 'center', minWidth: 80, paddingVertical: 4 },
  actionText: { color: '#00a884', fontSize: 13, fontWeight: '600', marginTop: 6 },
  
  infoSeparator: { height: 0.5, backgroundColor: '#222d34', marginVertical: 14 },
  
  // Secciones de datos de la lista
  infoRowDescription: { paddingVertical: 4 },
  descriptionText: { fontSize: 15, color: '#e9edef', lineHeight: 22 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  infoRowText: { color: '#e9edef', fontSize: 15, marginLeft: 16, flex: 1 },
  textContainerColumn: { marginLeft: 16, flex: 1 },
  infoRowTextBold: { color: '#e9edef', fontSize: 15, fontWeight: '700' },
  infoRowSubText: { color: '#8696a0', fontSize: 13, marginTop: 3, lineHeight: 18 },
  
  // Botón inferior de salida
  closeBtn: { height: 50, backgroundColor: '#00a884', justifyContent: 'center', alignItems: 'center' }
});

