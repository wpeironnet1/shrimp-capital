import React from 'react';
import { StyleSheet, View } from 'react-native';

type Pattern = 'solid' | 'banded' | 'striped' | 'spotted';
type Trait = 'long-whiskers' | 'fan-tail' | 'claws' | 'crown';
export type ShrimpAccessory = 'chain' | 'crown';

export function PixelShrimp({ color, accentColor = '#F5B6A9', pattern = 'solid', trait, accessory, size = 48, flip = false }: { color: string; accentColor?: string; pattern?: Pattern; trait?: Trait; accessory?: ShrimpAccessory; size?: number; flip?: boolean }) {
  const scale = size / 48;
  return (
    <View accessibilityLabel="Pixel shrimp" style={[styles.canvas, { width: size, height: 30 * scale, transform: [{ scaleX: flip ? -1 : 1 }] }]}>
      <View style={[styles.tail, { backgroundColor: color, transform: [{ rotate: '45deg' }, { scale }], left: 1 * scale, top: 9 * scale }]} />
      {trait === 'fan-tail' && <><View style={[styles.tailFin, { backgroundColor: accentColor, width: 11 * scale, height: 8 * scale, left: -2 * scale, top: 2 * scale, transform: [{ rotate: '-22deg' }] }]} /><View style={[styles.tailFin, { backgroundColor: accentColor, width: 11 * scale, height: 8 * scale, left: -2 * scale, top: 20 * scale, transform: [{ rotate: '22deg' }] }]} /></>}
      <View style={[styles.bodyBack, { backgroundColor: color, width: 16 * scale, height: 16 * scale, left: 9 * scale, top: 7 * scale }]} />
      <View style={[styles.bodyFront, { backgroundColor: color, width: 18 * scale, height: 18 * scale, left: 21 * scale, top: 5 * scale }]} />
      <View style={[styles.head, { backgroundColor: color, width: 11 * scale, height: 13 * scale, left: 36 * scale, top: 4 * scale }]} />
      {pattern === 'banded' && <><View style={[styles.mark, { backgroundColor: accentColor, width: 5 * scale, height: 16 * scale, left: 16 * scale, top: 7 * scale }]} /><View style={[styles.mark, { backgroundColor: accentColor, width: 5 * scale, height: 17 * scale, left: 28 * scale, top: 6 * scale }]} /></>}
      {pattern === 'striped' && <><View style={[styles.mark, { backgroundColor: accentColor, width: 3 * scale, height: 16 * scale, left: 15 * scale, top: 7 * scale }]} /><View style={[styles.mark, { backgroundColor: accentColor, width: 3 * scale, height: 17 * scale, left: 23 * scale, top: 6 * scale }]} /><View style={[styles.mark, { backgroundColor: accentColor, width: 3 * scale, height: 16 * scale, left: 31 * scale, top: 6 * scale }]} /></>}
      {pattern === 'spotted' && <><View style={[styles.spot, { backgroundColor: accentColor, width: 4 * scale, height: 4 * scale, left: 16 * scale, top: 10 * scale }]} /><View style={[styles.spot, { backgroundColor: accentColor, width: 4 * scale, height: 4 * scale, left: 27 * scale, top: 15 * scale }]} /><View style={[styles.spot, { backgroundColor: accentColor, width: 3 * scale, height: 3 * scale, left: 35 * scale, top: 8 * scale }]} /></>}
      <View style={[styles.highlight, { width: 19 * scale, height: 3 * scale, left: 17 * scale, top: 7 * scale }]} />
      <View style={[styles.eye, { width: 3 * scale, height: 3 * scale, left: 41 * scale, top: 5 * scale }]} />
      {trait === 'crown' && <><View style={[styles.crest, { backgroundColor: accentColor, width: 5 * scale, height: 7 * scale, left: 34 * scale, top: -1 * scale }]} /><View style={[styles.crest, { backgroundColor: accentColor, width: 5 * scale, height: 9 * scale, left: 40 * scale, top: -3 * scale }]} /></>}
      {accessory === 'chain' && <><View style={[styles.chain, { width: 18 * scale, height: 3 * scale, left: 22 * scale, top: 18 * scale, transform: [{ rotate: '12deg' }] }]} /><View style={[styles.pendant, { width: 5 * scale, height: 5 * scale, left: 30 * scale, top: 21 * scale }]} /></>}
      {accessory === 'crown' && <><View style={[styles.goldCrownBase, { width: 15 * scale, height: 4 * scale, left: 34 * scale, top: -3 * scale }]} /><View style={[styles.goldCrownPoint, { width: 4 * scale, height: 8 * scale, left: 35 * scale, top: -9 * scale }]} /><View style={[styles.goldCrownPoint, { width: 4 * scale, height: 11 * scale, left: 41 * scale, top: -12 * scale }]} /><View style={[styles.goldCrownPoint, { width: 4 * scale, height: 8 * scale, left: 47 * scale, top: -9 * scale }]} /></>}
      {trait === 'claws' && <><View style={[styles.arm, { backgroundColor: accentColor, width: 14 * scale, height: 3 * scale, left: 36 * scale, top: 18 * scale, transform: [{ rotate: '20deg' }] }]} /><View style={[styles.claw, { borderColor: accentColor, width: 9 * scale, height: 8 * scale, left: 47 * scale, top: 20 * scale }]} /></>}
      <View style={[styles.leg, { backgroundColor: accentColor, width: 3 * scale, height: 8 * scale, left: 20 * scale, top: 20 * scale, transform: [{ rotate: '24deg' }] }]} />
      <View style={[styles.leg, { backgroundColor: accentColor, width: 3 * scale, height: 8 * scale, left: 28 * scale, top: 20 * scale, transform: [{ rotate: '24deg' }] }]} />
      <View style={[styles.antenna, { backgroundColor: accentColor, width: 15 * scale, left: 43 * scale, top: 5 * scale, transform: [{ rotate: '-18deg' }] }]} />
      {trait === 'long-whiskers' && <><View style={[styles.antenna, { backgroundColor: accentColor, width: 28 * scale, left: 42 * scale, top: 3 * scale, transform: [{ rotate: '-25deg' }] }]} /><View style={[styles.antenna, { backgroundColor: accentColor, width: 25 * scale, left: 43 * scale, top: 12 * scale, transform: [{ rotate: '19deg' }] }]} /></>}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { position: 'relative' }, tail: { position: 'absolute', width: 12, height: 12 }, tailFin: { position: 'absolute' }, bodyBack: { position: 'absolute' }, bodyFront: { position: 'absolute' }, head: { position: 'absolute' },
  mark: { position: 'absolute' }, spot: { position: 'absolute' }, highlight: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.45)' }, eye: { position: 'absolute', backgroundColor: '#071A22' },
  leg: { position: 'absolute', backgroundColor: '#F5B6A9' }, antenna: { position: 'absolute', height: 2, backgroundColor: '#F5B6A9' }, crest: { position: 'absolute' }, arm: { position: 'absolute' }, claw: { position: 'absolute', borderWidth: 3, borderLeftWidth: 0, backgroundColor: 'transparent' }, chain: { position: 'absolute', backgroundColor: '#FFD24A', borderBottomWidth: 1, borderBottomColor: '#9E691D' }, pendant: { position: 'absolute', backgroundColor: '#FFE37B', borderWidth: 1, borderColor: '#9E691D', transform: [{ rotate: '45deg' }] }, goldCrownBase: { position: 'absolute', backgroundColor: '#F2B92E', borderBottomWidth: 1, borderBottomColor: '#8F5E17' }, goldCrownPoint: { position: 'absolute', backgroundColor: '#FFD95A' },
});
