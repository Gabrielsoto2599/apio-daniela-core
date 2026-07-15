import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

// Definimos el mapa con nombres simples para evitar errores de TypeScript
const MAPPING: Record<string, React.ComponentProps<typeof MaterialIcons>['name']> = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left': 'chevron-left',
  'chevron.right': 'chevron-right',
  'more-vert': 'more-vert',
  'videocam': 'videocam',
  'call': 'call',
  'checkmark.double': 'done-all',
  'play.fill': 'play-arrow',
  'face.smiling': 'sentiment-satisfied-alt',
  'paperclip': 'attach-file',
  'camera.fill': 'photo-camera',
  'mic.fill': 'mic',
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  // Si el nombre no está en el mapa, intenta usar el nombre directamente
  const iconName = MAPPING[name] || (name as any);
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}