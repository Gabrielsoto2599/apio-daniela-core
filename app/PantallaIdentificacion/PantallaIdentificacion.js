// ====================================================================
// PANTALLAIDENTIFICACION.JS - REGISTRO DE IDENTIDAD SAAS (SOTO SYSTEM 2026)
// Ubicación: app/PantallaIdentificacion/PantallaIdentificacion.js (Con Avatar)
// ====================================================================
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

// 🚀 IMPORTACIÓN DE ASSETS SANEADA: Ruta relativa exacta desde tu subcarpeta
const profilePic = require('../../apio-app/assets/images/foto-perfil-apio.png');

export default function PantallaIdentificacion({ onGuardarNombre }) {
  const [inputNombre, setInputNombre] = useState('');

  const handlePress = () => {
    if (!inputNombre.trim()) return;
    onGuardarNombre(inputNombre.trim());
  };

    return (
    <View style={styles.loginContainer}>
      
      {/* 📸 AVATAR FLOTANTE GIGANTE MULTIPLATAFORMA (PC + MÓVIL) */}
      <View style={styles.avatarWrapper}>
        <Image 
          // 🚀 ¡ENCENDIDO!: Le inyectamos la variable local legítima para que use tu .png real
          source={profilePic} 
          style={styles.avatarLoginImage} 
        />
        {/* Indicador de estado neón */}
        <View style={styles.avatarStatusDot} />
      </View>

      <Text style={styles.loginTitle}>Ecosistema Soto System 2026</Text>
      <Text style={styles.loginSub}>Identifícate para que Daniela IA reconozca tu identidad o rol de caja</Text>

      
      <TextInput
        style={styles.input}
        placeholder="Introduce tu nombre (Ej: Rosmary, Gabriel...)"
        placeholderTextColor="#8696a0"
        value={inputNombre}
        onChangeText={setInputNombre}
      />
      
      <TouchableOpacity style={styles.btn} onPress={handlePress} activeOpacity={0.8}>
        <Text style={styles.btnText}>ENCENDER CONCIENCIA DANIELA 🚀</Text>
      </TouchableOpacity>
    </View>
  );
}

// ====================================================================
// HOJA DE ESTILOS PREMIUM CON AMORTIGUACIÓN Y SOMBRAS DE HARDWARE
// ====================================================================
const styles = StyleSheet.create({
  loginContainer: { flex: 1, backgroundColor: '#0c111d', justifyContent: 'center', padding: 24 },
  
  // 🚀 DISEÑO DEL CONTENEDOR DEL AVATAR
  avatarWrapper: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 28, // Separación simétrica perfecta respecto al título
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  avatarLoginImage: {
    width: 120, // Tamaño grande e impactante solicitado para el monitor
    height: 120,
    borderRadius: 60, // Fuerza el círculo perfecto
    borderWidth: 3,
    borderColor: '#202c33', // Borde gris de alto contraste estilo WhatsApp Plus
    backgroundColor: '#111b21',
  },
  avatarStatusDot: {
    position: 'absolute',
    bottom: 4,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00E676', // Verde esmeralda vivo idéntico al botón de acción
    borderWidth: 3.5,
    borderColor: '#0c111d', // Da el efecto flotante fusionándose con el fondo oscuro
  },

  // Estilos del Formulario
  loginTitle: { color: '#e9edef', fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 8, fontFamily: 'System' },
  loginSub: { color: '#8696a0', fontSize: 13, textAlign: 'center', marginBottom: 24, paddingHorizontal: 16, fontFamily: 'System' },
  input: { backgroundColor: '#202c33', color: '#fff', borderRadius: 12, padding: 16, fontSize: 15, marginBottom: 16, borderWidth: 1, borderColor: '#2a3942', fontFamily: 'System' },
  btn: { backgroundColor: '#00a884', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 14, fontFamily: 'System' }
});
