import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { DailyRewardCard } from '../components/DailyRewardCard';
import { MissionPanel } from '../components/MissionPanel';
import { OfflineReport } from '../components/OfflineReport';
import { PixelShrimp } from '../components/PixelShrimp';
import { PixelText } from '../components/PixelText';
import { Tank } from '../components/Tank';
import { TankConditionPanel } from '../components/TankConditionPanel';
import { species } from '../game/catalog';
import { useGame } from '../game/GameProvider';
import { conditionMultiplier, secondsUntilNextHatch, tankHealth, totalShrimp, valueMultiplier, xpForNextLevel } from '../game/engine';
import { colors } from '../theme/colors';

export function FarmScreen() {
  const { state, hatchNow, sellOne, selectSpecies, offlineHatches, dismissOfflineReport, claimMission, claimDailyReward, feed, service } = useGame();
  const current = species.find((item) => item.id === state.selectedSpecies) ?? species[0];
  const tankFull = totalShrimp(state) >= state.tankCapacity;
  const nextHatch = secondsUntilNextHatch(state);
  const health = tankHealth(state);
  const conditionRate = Math.round(conditionMultiplier(state) * 100);
  const salePrice = Math.round(current.basePrice * valueMultiplier(state));
  const tintOpacity = Math.max(0, (78 - state.conditions.waterQuality) / 145);
  const tintColor = state.conditions.waterQuality < 45 ? '#6D6830' : '#557C55';

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
        <DailyRewardCard state={state} onClaim={claimDailyReward} />
        <View style={styles.tankWrap}>
          <Tank population={state.shrimp} accessoryPopulation={state.shrimpAccessories} capacity={state.tankCapacity} upgrades={state.upgrades} onPress={hatchNow} />
          {tintOpacity > 0 && <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, styles.conditionTint, { backgroundColor: tintColor, opacity: tintOpacity }]} />}
          {state.conditions.waterQuality < 62 && <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
            <View style={[styles.grime, styles.grimeOne]} /><View style={[styles.grime, styles.grimeTwo]} /><View style={[styles.grime, styles.grimeThree]} />
          </View>}
        </View>
        <View style={styles.productionBar} accessibilityLabel={tankFull ? 'Tank full' : `Next shrimp in ${nextHatch} seconds`}>
          <View style={[styles.liveDot, health < 65 && styles.liveDotDanger]} />
          <PixelText style={styles.productionLabel}>{tankFull ? 'TANK FULL — SELL OR EXPAND' : `AUTO-HATCH IN ${nextHatch}s`}</PixelText>
          <PixelText style={[styles.productionRate, conditionRate < 80 && styles.productionRateDanger]}>OPS {conditionRate}%</PixelText>
        </View>
        <TankConditionPanel state={state} onFeed={feed} onService={service} />
        <View style={styles.speciesHeading}><PixelText style={styles.sectionTitle}>CURRENT STOCK</PixelText><PixelText style={styles.rarity}>{current.rarity.toUpperCase()}</PixelText></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.speciesRow}>
          {species.map((item) => {
            const locked = item.unlockLevel > state.level;
            return (
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: locked, selected: state.selectedSpecies === item.id }} key={item.id} disabled={locked} onPress={() => selectSpecies(item.id)} style={({ pressed }) => [styles.speciesCard, locked && styles.speciesLocked, state.selectedSpecies === item.id && styles.speciesSelected, pressed && !locked && styles.cardPressed]}>
              <PixelShrimp color={item.color} accentColor={item.accentColor} pattern={item.pattern} trait={item.trait} size={34 + (item.rarity === 'Exotic' ? 7 : item.rarity === 'Mythic' ? 5 : item.rarity === 'Legendary' ? 3 : 0)} />
              <PixelText style={styles.speciesName}>{item.name}</PixelText>
              <PixelText style={styles.speciesRarity}>{item.rarity.toUpperCase()}</PixelText>
              <PixelText style={styles.speciesValue}>{locked ? `UNLOCK LV. ${item.unlockLevel}` : `$${Math.round(item.basePrice * valueMultiplier(state)).toLocaleString()} ea.`}</PixelText>
            </Pressable>
          );})}
        </ScrollView>
        <View style={styles.sellCard}>
          <View><PixelText style={styles.sellTitle}>Sell one {current.name}</PixelText><PixelText style={styles.sellDetail}>{state.shrimp[current.id] ?? 0} ready · Condition-adjusted quote</PixelText></View>
          <Pressable disabled={(state.shrimp[current.id] ?? 0) < 1} onPress={() => sellOne(current.id)} style={({ pressed }) => [styles.sellButton, (state.shrimp[current.id] ?? 0) < 1 && styles.sellDisabled, pressed && styles.sellPressed]}>
            <Ionicons name="cash" size={18} color={colors.ink} /><PixelText style={styles.sellButtonText}>SELL ${salePrice.toLocaleString()}</PixelText>
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
  tankWrap: { position: 'relative', overflow: 'hidden', borderRadius: 18 }, conditionTint: { borderRadius: 18 }, grime: { position: 'absolute', width: 7, height: 7, borderRadius: 4, backgroundColor: '#A7A75B', opacity: 0.32 }, grimeOne: { left: '14%', top: '31%' }, grimeTwo: { left: '74%', top: '57%', width: 10, height: 5 }, grimeThree: { left: '44%', top: '72%', width: 5, height: 9 },
  productionBar: { marginTop: -7, backgroundColor: '#0C313C', borderRadius: 10, paddingVertical: 9, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderColor: '#234B56' }, liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success }, liveDotDanger: { backgroundColor: colors.coral }, productionLabel: { color: colors.aqua, fontSize: 9, flex: 1 }, productionRate: { color: colors.muted, fontSize: 8 }, productionRateDanger: { color: colors.coral },
  speciesHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, sectionTitle: { fontSize: 13, letterSpacing: 1.5 }, rarity: { fontSize: 9, color: colors.coral }, speciesRow: { gap: 10 }, speciesCard: { width: 134, minHeight: 124, padding: 12, borderRadius: 14, backgroundColor: colors.panel, borderWidth: 2, borderColor: '#23515C', borderBottomWidth: 4 }, speciesLocked: { opacity: 0.42 }, speciesSelected: { borderColor: colors.coral, backgroundColor: '#184955' }, cardPressed: { transform: [{ translateY: 2 }], borderBottomWidth: 2 }, speciesName: { fontSize: 11, marginTop: 7 }, speciesRarity: { color: colors.aqua, fontSize: 7, marginTop: 5 }, speciesValue: { color: colors.gold, fontSize: 9, marginTop: 5 },
  sellCard: { backgroundColor: colors.cream, borderRadius: 16, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, sellTitle: { color: colors.ink, fontSize: 13 }, sellDetail: { color: '#4B666A', fontSize: 8, marginTop: 4 }, sellButton: { backgroundColor: colors.gold, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6, borderBottomWidth: 4, borderBottomColor: '#B17C24' }, sellButtonText: { color: colors.ink, fontSize: 10 }, sellDisabled: { opacity: 0.35 }, sellPressed: { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
});
