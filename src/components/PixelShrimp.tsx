import React from 'react';
import { StyleSheet, View } from 'react-native';

export function PixelShrimp({ color, size = 48, flip = false }: { color: string; size?: number; flip?: boolean }) {
  const scale = size / 48;
  return (
    <View accessibilityLabel="Pixel shrimp" style={[styles.canvas, { width: size, height: 30 * scale, transform: [{ scaleX: flip ? -1 : 1 }] }]}>
      <View style={[styles.tail, { backgroundColor: color, transform: [{ rotate: '45deg' }, { scale }], left: 1 * scale, top: 9 * scale }]} />
      <View style={[styles.bodyBack, { backgroundColor: color, width: 16 * scale, height: 16 * scale, left: 9 * scale, top: 7 * scale }]} />
      <View style={[styles.bodyFront, { backgroundColor: color, width: 18 * scale, height: 18 * scale, left: 21 * scale, top: 5 * scale }]} />
      <View style={[styles.head, { backgroundColor: color, width: 11 * scale, height: 13 * scale, left: 36 * scale, top: 4 * scale }]} />
      <View style={[styles.highlight, { width: 19 * scale, height: 3 * scale, left: 17 * scale, top: 7 * scale }]} />
      <View style={[styles.eye, { width: 3 * scale, height: 3 * scale, left: 41 * scale, top: 5 * scale }]} />
      <View style={[styles.leg, { width: 3 * scale, height: 8 * scale, left: 20 * scale, top: 20 * scale, transform: [{ rotate: '24deg' }] }]} />
      <View style={[styles.leg, { width: 3 * scale, height: 8 * scale, left: 28 * scale, top: 20 * scale, transform: [{ rotate: '24deg' }] }]} />
      <View style={[styles.antenna, { width: 15 * scale, left: 43 * scale, top: 5 * scale, transform: [{ rotate: '-18deg' }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { position: 'relative' }, tail: { position: 'absolute', width: 12, height: 12 }, bodyBack: { position: 'absolute' }, bodyFront: { position: 'absolute' }, head: { position: 'absolute' },
  highlight: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.45)' }, eye: { position: 'absolute', backgroundColor: '#071A22' },
  leg: { position: 'absolute', backgroundColor: '#F5B6A9' }, antenna: { position: 'absolute', height: 2, backgroundColor: '#F5B6A9' },
});
