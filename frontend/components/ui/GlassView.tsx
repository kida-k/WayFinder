import React from 'react';
import { StyleSheet, ViewProps, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassViewProps extends ViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  borderRadius?: number;
}

export function GlassView({ 
  children, 
  style, 
  intensity = 50, 
  tint = 'light', 
  borderRadius = 20,
  ...props 
}: GlassViewProps) {
  return (
    <View style={[styles.container, { borderRadius }, style]} {...props}>
      <BlurView 
        intensity={intensity} 
        tint={tint} 
        style={[StyleSheet.absoluteFill, { borderRadius }]} 
      />
      <View style={[styles.content, { borderRadius }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Platform.select({
      ios: 'rgba(255, 255, 255, 0.3)',
      android: 'rgba(255, 255, 255, 0.8)',
      default: 'rgba(255, 255, 255, 0.3)',
    }),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  content: {
    padding: 0,
  },
});
