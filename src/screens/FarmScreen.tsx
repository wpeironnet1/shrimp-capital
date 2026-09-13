import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { PixelText } from '../components/PixelText';
import { OfflineReport } from '../components/OfflineReport';
import { MissionPanel } from '../components/MissionPanel';
import { Tank } from '../components/Tank';
import { species } from '../game/catalog';
import { useGame } from '../game/GameProvider';
import { secondsUntilNextHatch, totalShrimp, xpForNextLevel } from '../game/engine';
import { colors } from '../theme/colors';

export function FarmScreen() {
  const { state, hatchNow, sellOne, selectSpecies, offlineHatches, dismissOfflineReport, claimMission } = useGame();
  const unlocked = species.filter((item) => item.unlockLevel <= state.level);
  const current = species.find((item) => item.id === state.selectedSpecies) ?? species[0];
  const tankFull = totalShrimp(state) >= state.tankCapacity;
  const nextHatch = secondsUntilNextHatch(state);
  return (
    <LinearGradient colors={[colors.ink, colors.deep]} style={styles.page}>
      <OfflineReport amount={offlineHatches} onClose={dismissOfflineReport} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View><PixelText style={styles.eyebrow}>SHRIMP CAPITAL</PixelText><PixelText style={styles.title}>The Bedroom Fund</PixelText></View>
          <View style={styles.money}><PixelText style={styles.moneyText}>${state.cash.toLocaleString()}</PixelText><PixelText style={styles.moneyHint}>LIQUID ASSETS</PixelText></View>
        </View>
        <View style={styles.levelRow}>
          <PixelText style={styles.level}>LV. {state.level}</PixelText>
          <View style={styles.xpTrack}><View style={[styles.xpFill, { width: `${Math.min(100, state.xp / xpForNextLevel(state.level) * 100)}%` }]} /></View>
          <PixelText style={styles.xp}>{state.xp} XP</PixelText>
        </View>
        <MissionPanel state={state} onClaim={claimMission} />
        <Tank count={totalShrimp(state)} capacity={state.tankCapacity} onPress={hatchNow} />
        <View style={styles.productionBar} accessibilityLabel={tankFull ? 'Tank full' : `Next shrimp in ${nextHatch} seconds`}>
          <View style={styles.liveDot} />
          <PixelText style={styles.productionLabel}>{tankFull ? 'TANK FULL — SELL OR EXPAND' : `AUTO-HATCH IN ${nextHatch}s`}</PixelText>
          <PixelText style={styles.productionRate}>1 every {Math.ceil(current.hatchSeconds / (1 + (state.upgrades.heater ?? 0) * 0.15))}s</PixelText>
        </View>
        <View style={styles.speciesHeading}><PixelText style={styles.sectionTitle}>CURRENT STOCK</PixelText><PixelText style={styles.rarity}>{current.rarity.toUpperCase()}</PixelText></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.speciesRow}>
          {unlocked.map((item) => (
            <Pressable key={item.id} onPress={() => selectSpecies(item.id)} style={[styles.speciesCard, state.selectedSpecies === item.id && styles.speciesSelected]}>
              <PixelText style={[styles.miniShrimp, { color: item.color }]}>🦐</PixelText>
              <PixelText style={styles.speciesName}>{item.name}</PixelText>
              <PixelText style={styles.speciesValue}>${item.basePrice} ea.</PixelText>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.sellCard}>
          <View><PixelText style={styles.sellTitle}>Sell one {current.name}</PixelText><PixelText style={styles.sellDetail}>{state.shrimp[current.id] ?? 0} ready · Market is irrational</PixelText></View>
          <Pressable disabled={(state.shrimp[current.id] ?? 0) < 1} onPress={() => sellOne(current.id)} style={({ pressed }) => [styles.sellButton, pressed && { opacity: 0.8 }]}>
            <Ionicons name="cash" size={18} color={colors.ink} /><PixelText style={styles.sellButtonText}>SELL ${current.basePrice}</PixelText>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 }, content: { padding: 18, paddingBottom: 115, gap: 16 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  eyebrow: { fontSize: 11, color: colors.coral, letterSpacing: 2.4 }, title: { fontSize: 24, marginTop: 3 }, money: { alignItems: 'flex-end', backgroundColor: '#0C313C', borderRadius: 12, paddingVertical: 9, paddingHorizontal: 12, borderWidth: 1, borderColor: '#28515C' }, moneyText: { color: colors.gold, fontSize: 18 }, moneyHint: { color: colors.muted, fontSize: 7, marginTop: 2 },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 }, level: { color: colors.aqua, fontSize: 11 }, xp: { color: colors.muted, fontSize: 9 }, xpTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#1B414B', overflow: 'hidden' }, xpFill: { height: '100%', backgroundColor: colors.aqua },
  productionBar: { marginTop: -7, backgroundColor: '#0C313C', borderRadius: 10, paddingVertical: 9, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderColor: '#234B56' }, liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success }, productionLabel: { color: colors.aqua, fontSize: 9, flex: 1 }, productionRate: { color: colors.muted, fontSize: 8 },
  speciesHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, sectionTitle: { fontSize: 13, letterSpacing: 1.5 }, rarity: { fontSize: 9, color: colors.coral }, speciesRow: { gap: 10 }, speciesCard: { width: 125, padding: 12, borderRadius: 14, backgroundColor: colors.panel, borderWidth: 2, borderColor: '#23515C' }, speciesSelected: { borderColor: colors.coral, backgroundColor: '#184955' }, miniShrimp: { fontSize: 30 }, speciesName: { fontSize: 12, marginTop: 7 }, speciesValue: { color: colors.gold, fontSize: 10, marginTop: 5 },
  sellCard: { backgroundColor: colors.cream, borderRadius: 16, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, sellTitle: { color: colors.ink, fontSize: 13 }, sellDetail: { color: '#4B666A', fontSize: 8, marginTop: 4 }, sellButton: { backgroundColor: colors.gold, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6 }, sellButtonText: { color: colors.ink, fontSize: 10 },
});
