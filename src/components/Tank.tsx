import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PixelText } from './PixelText';
import { colors } from '../theme/colors';
import { PixelShrimp } from './PixelShrimp';

export function Tank({ count, capacity, color, onPress }: { count: number; capacity: number; color: string; onPress: () => void }) {
  const bob = useRef(new Animated.Value(0)).current;
  const swim = useRef(new Animated.Value(-85)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: -7, duration: 900, useNativeDriver: true }),
      Animated.timing(bob, { toValue: 5, duration: 900, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(swim, { toValue: 85, duration: 4200, useNativeDriver: true }),
      Animated.timing(swim, { toValue: -85, duration: 4200, useNativeDriver: true }),
    ])).start();
  }, [bob, swim]);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.shell, pressed && { transform: [{ scale: 0.985 }] }]}>
      <LinearGradient colors={['#1F7F91', '#0C5368', '#092C3B']} style={styles.water}>
        <View style={styles.bubbles}><PixelText style={styles.bubble}>○  ·  ○    ·</PixelText></View>
        <Animated.View style={[styles.heroShrimp, { transform: [{ translateX: swim }, { translateY: bob }] }]}><PixelShrimp color={color} size={74} /></Animated.View>
        {count > 3 && <View style={styles.smallOne}><PixelShrimp color={color} size={37} flip /></View>}
        {count > 8 && <View style={styles.smallTwo}><PixelShrimp color={color} size={28} /></View>}
        <View style={styles.plant}><View style={styles.stem} /><View style={[styles.leaf, styles.leafLeft]} /><View style={[styles.leaf, styles.leafRight]} /></View>
        <View style={styles.sand} />
        <View style={styles.caption}>
          <PixelText style={styles.count}>{count} / {capacity}</PixelText>
          <PixelText style={styles.hint}>TAP TANK TO HATCH</PixelText>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: { height: 260, borderWidth: 5, borderColor: '#285765', borderRadius: 22, overflow: 'hidden', backgroundColor: colors.deep, shadowColor: '#000', shadowOpacity: 0.45, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } },
  water: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bubbles: { position: 'absolute', top: 24, left: 22 }, bubble: { color: '#8EE8E2', opacity: 0.65, fontSize: 22 },
  heroShrimp: { marginTop: -15, zIndex: 2 }, smallOne: { position: 'absolute', left: 45, top: 65, opacity: 0.85 }, smallTwo: { position: 'absolute', right: 60, bottom: 60, opacity: 0.7 },
  plant: { position: 'absolute', left: 25, bottom: 27, width: 28, height: 65 }, stem: { position: 'absolute', left: 12, bottom: 0, width: 5, height: 60, backgroundColor: '#3A8F68' }, leaf: { position: 'absolute', width: 18, height: 8, backgroundColor: '#55B579' }, leafLeft: { left: 0, top: 25, transform: [{ rotate: '25deg' }] }, leafRight: { right: 0, top: 10, transform: [{ rotate: '-30deg' }] },
  sand: { position: 'absolute', bottom: 0, height: 36, width: '100%', backgroundColor: '#C99B62', borderTopWidth: 5, borderTopColor: '#E7BE7B' },
  caption: { position: 'absolute', top: 14, right: 15, alignItems: 'flex-end' }, count: { fontSize: 18 }, hint: { fontSize: 9, color: colors.aqua, marginTop: 3 },
});
