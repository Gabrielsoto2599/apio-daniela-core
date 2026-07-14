// ====================================================================
// PANTALLAIDENTIFICACION.JS - REGISTRO DE IDENTIDAD SAAS (SOTO SYSTEM 2026)
// Ubicación: app/PantallaIdentificacion/PantallaIdentificacion.js
// ====================================================================
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function PantallaIdentificacion({ onGuardarNombre }) {
  const [inputNombre, setInputNombre] = useState('');

  const handlePress = () => {
    if (!inputNombre.trim()) return;
    onGuardarNombre(inputNombre.trim());
  };

  return (
    <View style={styles.loginContainer}>
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

const styles = StyleSheet.create({
  loginContainer: { flex: 1, backgroundColor: '#0c111d', justifyContent: 'center', padding: 24 },
  loginTitle: { color: '#e9edef', fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 8, fontFamily: 'System' },
  loginSub: { color: '#8696a0', fontSize: 13, textAlign: 'center', marginBottom: 24, paddingHorizontal: 16, fontFamily: 'System' },
  input: { backgroundColor: '#202c33', color: '#fff', borderRadius: 12, padding: 16, fontSize: 15, marginBottom: 16, borderWidth: 1, borderColor: '#2a3942', fontFamily: 'System' },
  btn: { backgroundColor: '#00a884', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 14, fontFamily: 'System' }
});
