import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PixelText } from './PixelText';
import { colors } from '../theme/colors';

export function Tank({ count, capacity, onPress }: { count: number; capacity: number; onPress: () => void }) {
  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: -7, duration: 900, useNativeDriver: true }),
      Animated.timing(bob, { toValue: 5, duration: 900, useNativeDriver: true }),
    ])).start();
  }, [bob]);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.shell, pressed && { transform: [{ scale: 0.985 }] }]}>
      <LinearGradient colors={['#1F7F91', '#0C5368', '#092C3B']} style={styles.water}>
        <View style={styles.bubbles}><PixelText style={styles.bubble}>○  ·  ○    ·</PixelText></View>
        <Animated.View style={[styles.shrimp, { transform: [{ translateY: bob }] }]}><PixelText style={styles.shrimpText}>🦐</PixelText></Animated.View>
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
  shrimp: { marginTop: -15 }, shrimpText: { fontSize: 78, textShadowColor: '#06222D', textShadowRadius: 0, textShadowOffset: { width: 5, height: 5 } },
  sand: { position: 'absolute', bottom: 0, height: 36, width: '100%', backgroundColor: '#C99B62', borderTopWidth: 5, borderTopColor: '#E7BE7B' },
  caption: { position: 'absolute', top: 14, right: 15, alignItems: 'flex-end' }, count: { fontSize: 18 }, hint: { fontSize: 9, color: colors.aqua, marginTop: 3 },
});
