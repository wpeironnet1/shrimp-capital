import React from 'react';
import { StyleSheet, View } from 'react-native';

type Pattern = 'solid' | 'banded' | 'striped' | 'spotted';
type Trait = 'long-whiskers' | 'fan-tail' | 'claws' | 'crown';
export type ShrimpAccessory = 'chain' | 'crown' | 'visor';

export function PixelShrimp({ color, accentColor = '#F5B6A9', pattern = 'solid', trait, accessory, size = 48, flip = false }: { color: string; accentColor?: string; pattern?: Pattern; trait?: Trait; accessory?: ShrimpAccessory; size?: number; flip?: boolean }) {
  const scale = size / 48;
  const px = (value: number) => value * scale;
  const surpriseVisor = React.useRef(accessory === undefined && Math.random() < 1 / 500).current;
  const showVisor = accessory === 'visor' || surpriseVisor;
  return (
    <View accessibilityLabel="Pixel shrimp" style={[styles.canvas, { width: size, height: px(34), transform: [{ scaleX: flip ? -1 : 1 }] }]}>
      <View style={[styles.tailShadow, { width: px(12), height: px(12), left: px(1), top: px(10), transform: [{ rotate: '45deg' }] }]} />
      <View style={[styles.tail, { backgroundColor: color, width: px(12), height: px(12), left: px(2), top: px(9), transform: [{ rotate: '45deg' }] }]} />
      <View style={[styles.tailHighlight, { backgroundColor: accentColor, width: px(5), height: px(5), left: px(2), top: px(7), transform: [{ rotate: '45deg' }] }]} />
      {trait === 'fan-tail' && <><View style={[styles.tailFin, { backgroundColor: accentColor, width: px(12), height: px(8), left: px(-2), top: px(2), transform: [{ rotate: '-22deg' }] }]} /><View style={[styles.tailFin, { backgroundColor: accentColor, width: px(12), height: px(8), left: px(-2), top: px(21), transform: [{ rotate: '22deg' }] }]} /></>}

      <View style={[styles.bodyShadow, { width: px(18), height: px(17), left: px(9), top: px(8) }]} />
      <View style={[styles.bodyBack, { backgroundColor: color, width: px(17), height: px(16), left: px(9), top: px(7) }]} />
      <View style={[styles.bodyMidShadow, { width: px(19), height: px(19), left: px(20), top: px(6) }]} />
      <View style={[styles.bodyFront, { backgroundColor: color, width: px(18), height: px(18), left: px(21), top: px(5) }]} />
      <View style={[styles.headShadow, { width: px(12), height: px(14), left: px(35), top: px(5) }]} />
      <View style={[styles.head, { backgroundColor: color, width: px(11), height: px(13), left: px(36), top: px(4) }]} />

      {pattern === 'banded' && <><View style={[styles.mark, { backgroundColor: accentColor, width: px(5), height: px(16), left: px(16), top: px(7) }]} /><View style={[styles.mark, { backgroundColor: accentColor, width: px(5), height: px(17), left: px(28), top: px(6) }]} /></>}
      {pattern === 'striped' && <><View style={[styles.mark, { backgroundColor: accentColor, width: px(3), height: px(16), left: px(15), top: px(7) }]} /><View style={[styles.mark, { backgroundColor: accentColor, width: px(3), height: px(17), left: px(23), top: px(6) }]} /><View style={[styles.mark, { backgroundColor: accentColor, width: px(3), height: px(16), left: px(31), top: px(6) }]} /></>}
      {pattern === 'spotted' && <><View style={[styles.spot, { backgroundColor: accentColor, width: px(4), height: px(4), left: px(16), top: px(10) }]} /><View style={[styles.spot, { backgroundColor: accentColor, width: px(4), height: px(4), left: px(27), top: px(15) }]} /><View style={[styles.spot, { backgroundColor: accentColor, width: px(3), height: px(3), left: px(35), top: px(8) }]} /></>}

      <View style={[styles.highlight, { width: px(17), height: px(2), left: px(18), top: px(7) }]} />
      <View style={[styles.shellPixel, { backgroundColor: accentColor, width: px(3), height: px(2), left: px(12), top: px(11) }]} />
      <View style={[styles.shellPixel, { backgroundColor: accentColor, width: px(2), height: px(2), left: px(25), top: px(18) }]} />
      <View style={[styles.eyeWhite, { width: px(4), height: px(4), left: px(40), top: px(4) }]} />
      <View style={[styles.eye, { width: px(2.5), height: px(2.5), left: px(41), top: px(5) }]} />

      {trait === 'crown' && <><View style={[styles.crest, { backgroundColor: accentColor, width: px(5), height: px(7), left: px(34), top: px(-1) }]} /><View style={[styles.crest, { backgroundColor: accentColor, width: px(5), height: px(9), left: px(40), top: px(-3) }]} /></>}
      {accessory === 'chain' && <><View style={[styles.chain, { width: px(18), height: px(3), left: px(22), top: px(18), transform: [{ rotate: '12deg' }] }]} /><View style={[styles.pendant, { width: px(5), height: px(5), left: px(30), top: px(21) }]} /></>}
      {accessory === 'crown' && <><View style={[styles.goldCrownBase, { width: px(15), height: px(4), left: px(34), top: px(-3) }]} /><View style={[styles.goldCrownPoint, { width: px(4), height: px(8), left: px(35), top: px(-9) }]} /><View style={[styles.goldCrownPoint, { width: px(4), height: px(11), left: px(41), top: px(-12) }]} /><View style={[styles.goldCrownPoint, { width: px(4), height: px(8), left: px(47), top: px(-9) }]} /></>}
      {showVisor && <><View style={[styles.visorBand, { width: px(18), height: px(3), left: px(32), top: px(1), transform: [{ rotate: '-7deg' }] }]} /><View style={[styles.visorBill, { width: px(14), height: px(4), left: px(36), top: px(-2), transform: [{ rotate: '-7deg' }] }]} /><View style={[styles.visorHighlight, { width: px(6), height: px(1.5), left: px(38), top: px(-1) }]} /></>}

      {trait === 'claws' && <><View style={[styles.arm, { backgroundColor: accentColor, width: px(14), height: px(3), left: px(36), top: px(18), transform: [{ rotate: '20deg' }] }]} /><View style={[styles.claw, { borderColor: accentColor, width: px(9), height: px(8), left: px(47), top: px(20), borderWidth: Math.max(1, px(3)) }]} /></>}
      <View style={[styles.leg, { backgroundColor: accentColor, width: px(2), height: px(8), left: px(17), top: px(21), transform: [{ rotate: '28deg' }] }]} />
      <View style={[styles.leg, { backgroundColor: accentColor, width: px(2), height: px(9), left: px(22), top: px(21), transform: [{ rotate: '20deg' }] }]} />
      <View style={[styles.leg, { backgroundColor: accentColor, width: px(2), height: px(8), left: px(28), top: px(21), transform: [{ rotate: '26deg' }] }]} />
      <View style={[styles.leg, { backgroundColor: accentColor, width: px(2), height: px(7), left: px(33), top: px(20), transform: [{ rotate: '18deg' }] }]} />
      <View style={[styles.antenna, { backgroundColor: accentColor, width: px(16), left: px(43), top: px(5), transform: [{ rotate: '-18deg' }] }]} />
      <View style={[styles.antenna, { backgroundColor: accentColor, width: px(13), left: px(44), top: px(11), transform: [{ rotate: '13deg' }] }]} />
      {trait === 'long-whiskers' && <><View style={[styles.antenna, { backgroundColor: accentColor, width: px(28), left: px(42), top: px(3), transform: [{ rotate: '-25deg' }] }]} /><View style={[styles.antenna, { backgroundColor: accentColor, width: px(25), left: px(43), top: px(12), transform: [{ rotate: '19deg' }] }]} /></>}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { position: 'relative' }, tail: { position: 'absolute' }, tailShadow: { position: 'absolute', backgroundColor: '#071A2255' }, tailHighlight: { position: 'absolute', opacity: 0.7 }, tailFin: { position: 'absolute' },
  bodyShadow: { position: 'absolute', backgroundColor: '#071A2244' }, bodyMidShadow: { position: 'absolute', backgroundColor: '#071A224A' }, headShadow: { position: 'absolute', backgroundColor: '#071A2250' }, bodyBack: { position: 'absolute' }, bodyFront: { position: 'absolute' }, head: { position: 'absolute' },
  mark: { position: 'absolute' }, spot: { position: 'absolute' }, highlight: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.5)' }, shellPixel: { position: 'absolute', opacity: 0.65 }, eyeWhite: { position: 'absolute', backgroundColor: '#F7FFF6' }, eye: { position: 'absolute', backgroundColor: '#071A22' },
  leg: { position: 'absolute' }, antenna: { position: 'absolute', height: 2 }, crest: { position: 'absolute' }, arm: { position: 'absolute' }, claw: { position: 'absolute', borderLeftWidth: 0, backgroundColor: 'transparent' }, chain: { position: 'absolute', backgroundColor: '#FFD24A', borderBottomWidth: 1, borderBottomColor: '#9E691D' }, pendant: { position: 'absolute', backgroundColor: '#FFE37B', borderWidth: 1, borderColor: '#9E691D', transform: [{ rotate: '45deg' }] }, goldCrownBase: { position: 'absolute', backgroundColor: '#F2B92E', borderBottomWidth: 1, borderBottomColor: '#8F5E17' }, goldCrownPoint: { position: 'absolute', backgroundColor: '#FFD95A' },
  visorBand: { position: 'absolute', backgroundColor: '#224B31', borderBottomWidth: 1, borderBottomColor: '#10281A' }, visorBill: { position: 'absolute', backgroundColor: '#4EA568', borderWidth: 1, borderColor: '#1E5B32' }, visorHighlight: { position: 'absolute', backgroundColor: '#A4E2AF' },
});
