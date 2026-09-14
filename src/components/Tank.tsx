import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, GestureResponderEvent, Pressable, StyleSheet, View } from 'react-native';
import { ShrimpSpecies, species } from '../game/catalog';
import { colors } from '../theme/colors';
import { PixelShrimp } from './PixelShrimp';
import { PixelText } from './PixelText';

const VISUAL_POPULATION_LIMIT = 24;
const raritySize: Record<ShrimpSpecies['rarity'], number> = { Common: 0, Uncommon: 1, Rare: 2, Epic: 4, Legendary: 7, Mythic: 10, Exotic: 13 };
type TankShrimp = { key: string; item: ShrimpSpecies };

function visiblePopulation(population: Record<string, number>) {
  const stocked = species.map((item) => ({ item, count: population[item.id] ?? 0, used: 0 })).filter((entry) => entry.count > 0);
  const result: TankShrimp[] = [];
  while (result.length < VISUAL_POPULATION_LIMIT && stocked.some((entry) => entry.used < entry.count)) {
    for (const entry of stocked) {
      if (entry.used >= entry.count || result.length >= VISUAL_POPULATION_LIMIT) continue;
      result.push({ key: `${entry.item.id}-${entry.used}`, item: entry.item });
      entry.used += 1;
    }
  }
  return result;
}

function ShrimpActor({ shrimp, index }: { shrimp: TankShrimp; index: number }) {
  const bob = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;
  const reaction = useRef(new Animated.Value(0)).current;
  const [flip, setFlip] = useState(index % 2 === 1);
  const reactionType = index % 3;
  const row = Math.floor(index / 6);
  const column = index % 6;
  const left = 5 + column * 15 + (row % 2) * 5;
  const top = 47 + row * 43 + ((index * 11) % 17);
  const size = (index === 0 ? 43 : 25 + ((index * 7) % 9)) + raritySize[shrimp.item.rarity];

  useEffect(() => {
    const bobLoop = Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: -4, duration: 750 + (index % 5) * 120, useNativeDriver: true }),
      Animated.timing(bob, { toValue: 4, duration: 750 + (index % 5) * 120, useNativeDriver: true }),
    ]));
    bobLoop.start();
    return () => bobLoop.stop();
  }, [bob, index]);

  useEffect(() => {
    let active = true;
    const distance = 9 + (index % 4) * 4;
    const duration = 2300 + (index % 6) * 310;
    const wander = (target: number) => {
      if (!active) return;
      setFlip(target < 0);
      Animated.timing(drift, { toValue: target, duration, useNativeDriver: true }).start(({ finished }) => {
        if (finished && active) wander(-target);
      });
    };
    wander(index % 2 === 0 ? distance : -distance);
    return () => { active = false; drift.stopAnimation(); };
  }, [drift, index]);

  const makeSwim = (event: GestureResponderEvent) => {
    event.stopPropagation();
    reaction.stopAnimation();
    reaction.setValue(0);
    const duration = reactionType === 2 ? 760 : reactionType === 0 ? 620 : 480;
    Animated.timing(reaction, { toValue: 1, duration, useNativeDriver: true }).start(() => {
      if (reactionType === 0) setFlip((value) => !value);
    });
  };

  const direction = flip ? -1 : 1;
  const reactionX = reactionType === 0
    ? reaction.interpolate({ inputRange: [0, 0.68, 1], outputRange: [0, 72 * direction, 0] })
    : reactionType === 1
      ? reaction.interpolate({ inputRange: [0, 0.3, 0.65, 1], outputRange: [0, 13 * direction, -9 * direction, 0] })
      : reaction.interpolate({ inputRange: [0, 0.45, 1], outputRange: [0, 5 * direction, 0] });
  const reactionY = reactionType === 1
    ? reaction.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -9, 0] })
    : reaction.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -3, 0] });
  const reactionRotate = reactionType === 0
    ? reaction.interpolate({ inputRange: [0, 0.68, 1], outputRange: ['0deg', `${360 * direction}deg`, `${360 * direction}deg`] })
    : reaction.interpolate({ inputRange: [0, 0.35, 0.7, 1], outputRange: ['0deg', `${9 * direction}deg`, `${-6 * direction}deg`, '0deg'] });
  return <Animated.View style={[styles.actor, { left: `${left}%` as `${number}%`, top, transform: [
    { translateY: bob },
    { translateX: drift },
    { translateX: reactionX },
    { translateY: reactionY },
    { rotate: reactionRotate },
  ] }]}>
    <Pressable accessibilityRole="button" accessibilityLabel={`Make ${shrimp.item.name} react`} hitSlop={8} onPress={makeSwim}>
      <PixelShrimp color={shrimp.item.color} accentColor={shrimp.item.accentColor} pattern={shrimp.item.pattern} trait={shrimp.item.trait} size={size} flip={flip} />
      {reactionType === 2 && <Animated.View pointerEvents="none" style={[styles.bubbleBurst, {
        opacity: reaction.interpolate({ inputRange: [0, 0.18, 0.72, 1], outputRange: [0, 1, 0.8, 0] }),
        transform: [{ translateY: reaction.interpolate({ inputRange: [0, 1], outputRange: [5, -25] }) }],
      }]}><PixelText style={styles.bubbleBurstText}>○ · ○</PixelText></Animated.View>}
    </Pressable>
  </Animated.View>;
}

function TankUpgrades({ upgrades, capacity }: { upgrades: Record<string, number>; capacity: number }) {
  const filter = upgrades.filter ?? 0;
  const heater = upgrades.heater ?? 0;
  const algae = upgrades.algae ?? 0;
  return <>
    {heater > 0 && <View accessibilityLabel={`Heater level ${heater}`} style={styles.heater}>
      <View style={[styles.heaterGlow, { opacity: Math.min(0.85, 0.25 + heater * 0.12) }]} /><View style={styles.heaterCore} /><PixelText style={styles.upgradeLevel}>H{heater}</PixelText>
    </View>}
    {filter > 0 && <View accessibilityLabel={`Filter level ${filter}`} style={styles.filter}>
      <View style={styles.filterPipe} /><View style={styles.filterBody}><View style={styles.filterSlat} /><View style={styles.filterSlat} /><View style={styles.filterSlat} /></View>
      <PixelText style={styles.upgradeLevel}>F{filter}</PixelText><PixelText style={styles.filterBubbles}>○{filter > 1 ? ' ·' : ''}{filter > 3 ? ' ○' : ''}</PixelText>
    </View>}
    {algae > 0 && <View accessibilityLabel={`Algae level ${algae}`} style={styles.algaeBed}>
      <View style={[styles.algaePatch, { opacity: Math.min(1, 0.45 + algae * 0.12) }]} /><View style={[styles.algaePatch, styles.algaePatchTwo, { opacity: Math.min(1, 0.35 + algae * 0.1) }]} />
      {algae > 2 && <View style={[styles.algaePatch, styles.algaePatchThree]} />}<PixelText style={styles.algaeLabel}>A{algae}</PixelText>
    </View>}
    {capacity > 20 && <View style={[styles.plant, styles.plantTwo]}><View style={styles.stem} /><View style={[styles.leaf, styles.leafLeft]} /><View style={[styles.leaf, styles.leafRight]} /></View>}
    {capacity > 40 && <View style={styles.rock}><View style={styles.rockHighlight} /></View>}
  </>;
}

export function Tank({ population, capacity, upgrades, onPress }: { population: Record<string, number>; capacity: number; upgrades: Record<string, number>; onPress: () => void }) {
  const shrimp = useMemo(() => visiblePopulation(population), [population]);
  const count = Object.values(population).reduce((sum, amount) => sum + amount, 0);
  return <Pressable accessibilityRole="button" accessibilityLabel={`Aquarium with ${count} shrimp. Tap open water to hatch another.`} onPress={onPress} style={({ pressed }) => [styles.shell, pressed && { transform: [{ scale: 0.985 }] }]}>
    <LinearGradient colors={['#1F7F91', '#0C5368', '#092C3B']} style={styles.water}>
      <View style={styles.bubbles}><PixelText style={styles.bubble}>○  ·  ○    ·</PixelText></View>
      <TankUpgrades upgrades={upgrades} capacity={capacity} />
      {shrimp.map((entry, index) => <ShrimpActor key={entry.key} shrimp={entry} index={index} />)}
      {count === 0 && <PixelText style={styles.empty}>TAP TO FUND YOUR FIRST SHRIMP</PixelText>}
      <View style={styles.plant}><View style={styles.stem} /><View style={[styles.leaf, styles.leafLeft]} /><View style={[styles.leaf, styles.leafRight]} /></View>
      <View style={styles.sand} />
      <View style={styles.caption}><PixelText style={styles.count}>{count} / {capacity}</PixelText><PixelText style={styles.hint}>{count > VISUAL_POPULATION_LIMIT ? `${VISUAL_POPULATION_LIMIT} ON SCREEN · ` : ''}TAP WATER TO HATCH</PixelText></View>
    </LinearGradient>
  </Pressable>;
}

const styles = StyleSheet.create({
  shell: { height: 285, borderWidth: 5, borderColor: '#285765', borderRadius: 22, overflow: 'hidden', backgroundColor: colors.deep, shadowColor: '#000', shadowOpacity: 0.45, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } },
  water: { flex: 1, alignItems: 'center', justifyContent: 'center' }, bubbles: { position: 'absolute', top: 24, left: 22 }, bubble: { color: '#8EE8E2', opacity: 0.65, fontSize: 22 }, actor: { position: 'absolute', zIndex: 3 }, bubbleBurst: { position: 'absolute', top: -7, right: -10, zIndex: 5 }, bubbleBurstText: { color: '#B8FFFA', fontSize: 10, textShadowColor: '#0B5366', textShadowRadius: 2 }, empty: { color: '#A8E5E1', opacity: 0.72, fontSize: 10 },
  plant: { position: 'absolute', left: 25, bottom: 27, width: 28, height: 65, zIndex: 2 }, plantTwo: { left: 74, height: 48, transform: [{ scaleX: -0.8 }] }, stem: { position: 'absolute', left: 12, bottom: 0, width: 5, height: 60, backgroundColor: '#3A8F68' }, leaf: { position: 'absolute', width: 18, height: 8, backgroundColor: '#55B579' }, leafLeft: { left: 0, top: 25, transform: [{ rotate: '25deg' }] }, leafRight: { right: 0, top: 10, transform: [{ rotate: '-30deg' }] },
  sand: { position: 'absolute', bottom: 0, height: 36, width: '100%', backgroundColor: '#C99B62', borderTopWidth: 5, borderTopColor: '#E7BE7B', zIndex: 1 }, caption: { position: 'absolute', top: 14, right: 15, alignItems: 'flex-end', zIndex: 6 }, count: { fontSize: 18 }, hint: { fontSize: 8, color: colors.aqua, marginTop: 3 },
  heater: { position: 'absolute', left: 8, top: 76, width: 14, height: 93, zIndex: 4, alignItems: 'center' }, heaterGlow: { position: 'absolute', width: 24, height: 93, borderRadius: 12, backgroundColor: '#FF755E' }, heaterCore: { width: 7, height: 78, marginTop: 7, borderRadius: 4, backgroundColor: '#FFB64A', borderWidth: 2, borderColor: '#4A2A27' },
  filter: { position: 'absolute', right: 7, bottom: 38, width: 42, height: 87, zIndex: 4, alignItems: 'center' }, filterPipe: { width: 10, height: 27, backgroundColor: '#6A8A8C', borderWidth: 2, borderColor: '#1A3B42' }, filterBody: { width: 33, height: 46, backgroundColor: '#385961', borderWidth: 3, borderColor: '#18343B', paddingTop: 7, gap: 5, alignItems: 'center' }, filterSlat: { width: 21, height: 3, backgroundColor: '#72A3A7' }, filterBubbles: { position: 'absolute', top: -14, right: 28, color: '#A6F2ED', fontSize: 12 }, upgradeLevel: { position: 'absolute', bottom: 4, color: '#FFF0BC', fontSize: 7 },
  algaeBed: { position: 'absolute', right: 58, bottom: 30, width: 80, height: 27, zIndex: 2 }, algaePatch: { position: 'absolute', bottom: 0, left: 0, width: 45, height: 18, borderRadius: 12, backgroundColor: '#55A84F' }, algaePatchTwo: { left: 30, width: 38, height: 23, backgroundColor: '#3B8F48' }, algaePatchThree: { left: 14, bottom: 10, width: 28, height: 14, backgroundColor: '#79C657' }, algaeLabel: { position: 'absolute', left: 29, bottom: 3, color: '#D8FFB5', fontSize: 7 },
  rock: { position: 'absolute', left: 108, bottom: 29, width: 42, height: 25, borderRadius: 9, backgroundColor: '#667579', zIndex: 2 }, rockHighlight: { width: 24, height: 5, marginLeft: 7, marginTop: 5, backgroundColor: '#8D9C98' },
});
