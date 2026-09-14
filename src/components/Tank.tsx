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

function EquipmentMotion({ kind, level }: { kind: 'filter' | 'heater'; level: number }) {
  const motion = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(motion, { toValue: 1, duration: kind === 'filter' ? 1700 : 1100, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [kind, motion]);
  const count = Math.min(5, 2 + Math.ceil(level / 2));
  return <View pointerEvents="none" style={kind === 'filter' ? styles.filterMotion : styles.heaterMotion}>
    {Array.from({ length: count }, (_, index) => <Animated.View key={index} style={[
      kind === 'filter' ? styles.equipmentBubble : styles.heatMote,
      {
        left: index * 7,
        opacity: motion.interpolate({ inputRange: [0, 0.15, 0.82, 1], outputRange: [0, 0.85, 0.55, 0] }),
        transform: [{ translateY: motion.interpolate({ inputRange: [0, 1], outputRange: [index * 4, -34 - index * 3] }) }],
      },
    ]} />)}
  </View>;
}

function TankUpgrades({ upgrades, capacity }: { upgrades: Record<string, number>; capacity: number }) {
  const filter = upgrades.filter ?? 0;
  const heater = upgrades.heater ?? 0;
  const algae = upgrades.algae ?? 0;
  const filterTier = Math.min(3, Math.ceil(filter / 2));
  const heaterTier = Math.min(3, Math.ceil(heater / 2));
  const algaeTier = Math.min(3, Math.ceil(algae / 2));
  return <>
    {heater > 0 && <View accessibilityLabel={`Heater level ${heater}`} style={styles.heater}>
      <View style={styles.heaterCable} /><View style={[styles.heaterGlow, { opacity: Math.min(0.85, 0.22 + heater * 0.1) }]} />
      <View style={[styles.heaterCap, heaterTier > 1 && styles.heaterCapAdvanced]} /><View style={styles.heaterCore}><View style={[styles.heatFill, { height: `${Math.min(88, 32 + heater * 9)}%` as `${number}%` }]} /></View>
      {heaterTier > 1 && <><View style={[styles.heaterTick, { top: 32 }]} /><View style={[styles.heaterTick, { top: 51 }]} /><View style={[styles.heaterTick, { top: 70 }]} /></>}
      {heaterTier > 2 && <View style={styles.heaterController}><View style={styles.controllerLight} /></View>}
      <EquipmentMotion kind="heater" level={heater} /><PixelText style={styles.heaterLevel}>H{heater}</PixelText>
    </View>}
    {filter > 0 && <View accessibilityLabel={`Filter level ${filter}`} style={styles.filter}>
      <View style={styles.filterPipe}><View style={styles.pipeHighlight} /></View><View style={styles.filterMotor}><View style={styles.motorLight} /></View>
      <View style={[styles.filterBody, filterTier > 1 && styles.filterBodyAdvanced]}><View style={styles.mediaWindow} /><View style={styles.filterSlat} /><View style={styles.filterSlat} /><View style={styles.filterSlat} /></View>
      {filterTier > 1 && <View style={styles.secondCanister}><View style={styles.mediaWindowBlue} /><View style={styles.canisterBand} /></View>}
      {filterTier > 2 && <View style={styles.filterIntake}><View style={styles.intakeFoot} /></View>}
      <EquipmentMotion kind="filter" level={filter} /><PixelText style={styles.filterLevel}>F{filter}</PixelText>
    </View>}
    {algae > 0 && <View accessibilityLabel={`Algae level ${algae}`} style={styles.algaeBed}>
      <View style={styles.algaeTray}><View style={styles.trayHighlight} /></View>
      <View style={[styles.algaePatch, { opacity: Math.min(1, 0.45 + algae * 0.12) }]} /><View style={[styles.algaePatch, styles.algaePatchTwo, { opacity: Math.min(1, 0.35 + algae * 0.1) }]} />
      {algaeTier > 1 && <><View style={[styles.algaePatch, styles.algaePatchThree]} /><View style={styles.algaeFrond}><View style={styles.frondTip} /></View></>}
      {algaeTier > 2 && <View style={styles.feeder}><View style={styles.feederFood} /><View style={styles.feederNeck} /></View>}
      <PixelText style={styles.algaeLabel}>A{algae}</PixelText>
    </View>}
    {capacity > 20 && <><View style={styles.tankBraceLeft} /><View style={styles.tankBraceRight} /><View style={[styles.plant, styles.plantTwo]}><View style={styles.stem} /><View style={[styles.leaf, styles.leafLeft]} /><View style={[styles.leaf, styles.leafRight]} /></View></>}
    {capacity > 40 && <View style={styles.rock}><View style={styles.rockHighlight} /><View style={styles.rockShadow} /></View>}
    {capacity > 60 && <View style={styles.expansionPipe}><View style={styles.expansionJoint} /><View style={styles.expansionJointBottom} /></View>}
    {capacity > 80 && <View style={styles.capexSign}><PixelText style={styles.capexText}>CAPEX</PixelText><View style={styles.capexLight} /></View>}
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
  heater: { position: 'absolute', left: 7, top: 66, width: 24, height: 108, zIndex: 4, alignItems: 'center' }, heaterCable: { position: 'absolute', top: -66, left: 10, width: 4, height: 72, backgroundColor: '#182C32' }, heaterGlow: { position: 'absolute', top: 9, width: 28, height: 91, borderRadius: 14, backgroundColor: '#FF755E' }, heaterCap: { width: 13, height: 9, backgroundColor: '#334B50', borderWidth: 2, borderColor: '#162D32' }, heaterCapAdvanced: { width: 19, backgroundColor: '#C38B3D' }, heaterCore: { width: 11, height: 83, overflow: 'hidden', justifyContent: 'flex-end', backgroundColor: '#472E2B', borderWidth: 2, borderColor: '#1D292B' }, heatFill: { width: '100%', backgroundColor: '#FF9B43' }, heaterTick: { position: 'absolute', right: 2, width: 7, height: 2, backgroundColor: '#FFE3A0' }, heaterController: { position: 'absolute', top: -18, left: 14, width: 23, height: 18, backgroundColor: '#314D53', borderWidth: 2, borderColor: '#142F35' }, controllerLight: { width: 5, height: 5, margin: 4, backgroundColor: '#6DFF9A' }, heaterLevel: { position: 'absolute', bottom: 8, color: '#FFF0BC', fontSize: 6 }, heaterMotion: { position: 'absolute', top: 35, right: -19, width: 30, height: 50 }, heatMote: { position: 'absolute', bottom: 0, width: 3, height: 3, backgroundColor: '#FFBD65' },
  filter: { position: 'absolute', right: 5, bottom: 37, width: 69, height: 112, zIndex: 4, alignItems: 'flex-end' }, filterPipe: { position: 'absolute', top: 1, right: 14, width: 12, height: 33, backgroundColor: '#607D82', borderWidth: 2, borderColor: '#18343B' }, pipeHighlight: { width: 3, height: 25, marginLeft: 2, backgroundColor: '#9BB3B3' }, filterMotor: { position: 'absolute', top: 24, right: 5, width: 30, height: 18, backgroundColor: '#263F45', borderWidth: 2, borderColor: '#132E35' }, motorLight: { width: 5, height: 5, marginLeft: 5, marginTop: 4, backgroundColor: '#6DF5E1' }, filterBody: { position: 'absolute', right: 4, bottom: 4, width: 34, height: 64, backgroundColor: '#385961', borderWidth: 3, borderColor: '#18343B', paddingTop: 7, gap: 5, alignItems: 'center' }, filterBodyAdvanced: { backgroundColor: '#315A64', borderColor: '#D69C43' }, mediaWindow: { width: 20, height: 13, backgroundColor: '#CE9E51', borderWidth: 2, borderColor: '#243D40' }, filterSlat: { width: 21, height: 3, backgroundColor: '#72A3A7' }, secondCanister: { position: 'absolute', left: 2, bottom: 4, width: 27, height: 55, backgroundColor: '#3A5962', borderWidth: 3, borderColor: '#18343B', alignItems: 'center', paddingTop: 6 }, mediaWindowBlue: { width: 15, height: 21, backgroundColor: '#68B6B9', borderWidth: 2, borderColor: '#203D42' }, canisterBand: { width: 20, height: 4, marginTop: 8, backgroundColor: '#D69C43' }, filterIntake: { position: 'absolute', left: -5, bottom: -1, width: 7, height: 75, backgroundColor: '#6B8889', borderWidth: 2, borderColor: '#17343B' }, intakeFoot: { position: 'absolute', bottom: 0, left: -5, width: 14, height: 9, backgroundColor: '#2A4B51' }, filterLevel: { position: 'absolute', right: 11, bottom: 8, color: '#FFF0BC', fontSize: 6 }, filterMotion: { position: 'absolute', top: 0, left: 4, width: 37, height: 50 }, equipmentBubble: { position: 'absolute', bottom: 0, width: 6, height: 6, borderRadius: 3, borderWidth: 2, borderColor: '#A6F2ED', backgroundColor: 'transparent' },
  algaeBed: { position: 'absolute', right: 69, bottom: 29, width: 96, height: 48, zIndex: 2 }, algaeTray: { position: 'absolute', bottom: 0, left: 0, width: 86, height: 13, backgroundColor: '#74573F', borderWidth: 3, borderColor: '#382E28' }, trayHighlight: { width: 73, height: 3, margin: 2, backgroundColor: '#A78258' }, algaePatch: { position: 'absolute', bottom: 8, left: 5, width: 45, height: 18, borderRadius: 12, backgroundColor: '#55A84F' }, algaePatchTwo: { left: 35, width: 38, height: 23, backgroundColor: '#3B8F48' }, algaePatchThree: { left: 20, bottom: 18, width: 32, height: 16, backgroundColor: '#79C657' }, algaeFrond: { position: 'absolute', left: 60, bottom: 17, width: 5, height: 29, backgroundColor: '#2C8248', transform: [{ rotate: '11deg' }] }, frondTip: { position: 'absolute', top: -2, left: -5, width: 15, height: 7, backgroundColor: '#75C866', transform: [{ rotate: '-20deg' }] }, feeder: { position: 'absolute', right: -1, bottom: 13, width: 25, height: 27, borderRadius: 7, backgroundColor: '#C8E1D5', borderWidth: 3, borderColor: '#35595A', overflow: 'visible' }, feederFood: { position: 'absolute', bottom: 3, left: 3, width: 13, height: 10, backgroundColor: '#5AA84F' }, feederNeck: { position: 'absolute', top: -9, left: 7, width: 7, height: 10, backgroundColor: '#D9A84E' }, algaeLabel: { position: 'absolute', left: 38, bottom: 3, color: '#D8FFB5', fontSize: 6 },
  tankBraceLeft: { position: 'absolute', left: 48, top: 0, width: 5, height: '100%', backgroundColor: 'rgba(122,191,194,0.18)', zIndex: 1 }, tankBraceRight: { position: 'absolute', right: 48, top: 0, width: 5, height: '100%', backgroundColor: 'rgba(122,191,194,0.18)', zIndex: 1 }, rock: { position: 'absolute', left: 108, bottom: 29, width: 48, height: 29, borderRadius: 9, backgroundColor: '#667579', zIndex: 2 }, rockHighlight: { width: 27, height: 5, marginLeft: 7, marginTop: 5, backgroundColor: '#8D9C98' }, rockShadow: { position: 'absolute', right: 3, bottom: 3, width: 17, height: 8, backgroundColor: '#475A60' }, expansionPipe: { position: 'absolute', top: 0, left: 91, width: 9, height: 45, backgroundColor: '#607B7D', borderWidth: 2, borderColor: '#1A393F', zIndex: 2 }, expansionJoint: { position: 'absolute', left: -5, bottom: 4, width: 15, height: 8, backgroundColor: '#A0713B' }, expansionJointBottom: { position: 'absolute', left: 1, bottom: -8, width: 19, height: 10, backgroundColor: '#48666B', borderWidth: 2, borderColor: '#1B383E' }, capexSign: { position: 'absolute', left: 111, top: 9, paddingVertical: 4, paddingHorizontal: 7, backgroundColor: '#213B43', borderWidth: 2, borderColor: '#D5A247', zIndex: 5 }, capexText: { color: '#FFD86B', fontSize: 7 }, capexLight: { position: 'absolute', right: -5, top: -5, width: 7, height: 7, backgroundColor: '#6DFF9A', borderWidth: 1, borderColor: '#18343B' },
});
