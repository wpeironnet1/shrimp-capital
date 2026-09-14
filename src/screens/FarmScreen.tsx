import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
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
import { conditionMultiplier, currentBiome, secondsUntilNextHatch, tankHealth, totalShrimp, valueMultiplier, xpForNextLevel } from '../game/engine';
import { colors } from '../theme/colors';

const accessoryCount = (population: Record<string, { chain: number; crown: number; visor?: number }>) => Object.values(population).reduce((sum, item) => sum + item.chain + item.crown + (item.visor ?? 0), 0);
type AmbientEvent = 'inspection' | 'power' | 'visitor' | 'treasure' | null;

export function FarmScreen() {
  const { state, hatchNow, sellOne, selectSpecies, offlineHatches, dismissOfflineReport, claimMission, claimDailyReward, feed, service } = useGame();
  const [feedingFrenzy, setFeedingFrenzy] = useState(false);
  const [rareCelebration, setRareCelebration] = useState(false);
  const [ambientEvent, setAmbientEvent] = useState<AmbientEvent>(null);
  const [inspectId, setInspectId] = useState<string | null>(null);
  const previousAccessories = useRef(accessoryCount(state.shrimpAccessories));
  const current = species.find((item) => item.id === state.selectedSpecies) ?? species[0];
  const inspected = species.find((item) => item.id === inspectId) ?? null;
  const tankFull = totalShrimp(state) >= state.tankCapacity;
  const nextHatch = secondsUntilNextHatch(state);
  const health = tankHealth(state);
  const conditionRate = Math.round(conditionMultiplier(state) * 100);
  const salePrice = Math.round(current.basePrice * valueMultiplier(state));
  const tintOpacity = Math.max(0, (78 - state.conditions.waterQuality) / 145);
  const tintColor = state.conditions.waterQuality < 45 ? '#6D6830' : '#557C55';
  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour < 7;
  const biome = currentBiome(state);

  useEffect(() => {
    const total = accessoryCount(state.shrimpAccessories);
    if (total > previousAccessories.current) {
      setRareCelebration(true);
      const timer = setTimeout(() => setRareCelebration(false), 2600);
      previousAccessories.current = total;
      return () => clearTimeout(timer);
    }
    previousAccessories.current = total;
  }, [state.shrimpAccessories]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        const events: AmbientEvent[] = ['inspection', 'power', 'visitor', 'treasure'];
        setAmbientEvent(events[Math.floor(Math.random() * events.length)]);
        setTimeout(() => setAmbientEvent(null), 4200);
        schedule();
      }, 18000 + Math.random() * 26000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  const handleFeed = () => {
    if (state.cash < 2 || state.conditions.feeding >= 98) return;
    feed();
    setFeedingFrenzy(true);
    setTimeout(() => setFeedingFrenzy(false), 1800);
  };

  const inspectedAccessories = inspected ? state.shrimpAccessories[inspected.id] ?? { chain: 0, crown: 0, visor: 0 } : null;
  const inspectAccessory = inspectedAccessories?.visor ? 'visor' : inspectedAccessories?.crown ? 'crown' : inspectedAccessories?.chain ? 'chain' : undefined;
  const inspectSeed = inspected ? inspected.id.length * 17 + (state.shrimp[inspected.id] ?? 0) * 3 + state.level : 0;

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
          {isNight && <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, styles.nightTint]} />}
          {tintOpacity > 0 && <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, styles.conditionTint, { backgroundColor: tintColor, opacity: tintOpacity }]} />}
          {state.conditions.waterQuality < 62 && <View pointerEvents="none" style={StyleSheet.absoluteFillObject}><View style={[styles.grime, styles.grimeOne]} /><View style={[styles.grime, styles.grimeTwo]} /><View style={[styles.grime, styles.grimeThree]} /></View>}

          {biome !== 'starter-office' && <View pointerEvents="none" style={styles.ticker}><PixelText style={styles.tickerText}>{biome === 'trading-floor' ? 'SHMP ▲ 4.2   KRLL ▼ 1.1   ALGA ▲ 8.7' : biome === 'executive-reef' ? 'EXECUTIVE REEF · PRIVATE CLIENT GROUP' : 'OFFSHORE FUND · CAYMAN TANK DESK'}</PixelText></View>}
          {(biome === 'executive-reef' || biome === 'offshore-fund') && <><View pointerEvents="none" style={styles.brassPipe} /><View pointerEvents="none" style={styles.brassValve}><View style={styles.valveLineA} /><View style={styles.valveLineB} /></View></>}
          {biome === 'offshore-fund' && <View pointerEvents="none" style={styles.offshorePlaque}><PixelText style={styles.offshoreText}>PRIVATE AQUATIC BANK</PixelText></View>}

          {feedingFrenzy && <View pointerEvents="none" style={StyleSheet.absoluteFillObject}><PixelText style={styles.frenzyText}>FEEDING FRENZY!</PixelText><View style={[styles.foodPellet, { left: '22%', top: '17%' }]} /><View style={[styles.foodPellet, { left: '37%', top: '11%' }]} /><View style={[styles.foodPellet, { left: '51%', top: '20%' }]} /><View style={[styles.foodPellet, { left: '66%', top: '14%' }]} /><View style={[styles.foodPellet, { left: '78%', top: '23%' }]} /></View>}
          {rareCelebration && <View pointerEvents="none" style={styles.rareCelebration}><PixelText style={styles.rareTop}>★ RARE ASSET DISCOVERED ★</PixelText><PixelText style={styles.rareSub}>Crown, chain, or accountant visor added to inventory.</PixelText></View>}

          {ambientEvent === 'power' && <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, styles.powerFailure]}><PixelText style={styles.eventHeadline}>⚠ POWER FAILURE</PixelText><PixelText style={styles.eventSub}>Emergency generator is negotiating terms.</PixelText></View>}
          {ambientEvent === 'inspection' && <View pointerEvents="none" style={styles.inspectionEvent}><Ionicons name="clipboard" size={17} color={colors.cream} /><View><PixelText style={styles.eventHeadline}>SURPRISE INSPECTION</PixelText><PixelText style={styles.eventSub}>Act natural. Hide the offshore algae.</PixelText></View></View>}
          {ambientEvent === 'visitor' && <View pointerEvents="none" style={StyleSheet.absoluteFillObject}><View style={styles.visitorFish}><View style={styles.visitorBody} /><View style={styles.visitorTail} /><View style={styles.visitorEye} /></View><PixelText style={styles.visitorLabel}>VISITING WHALE ANALYST</PixelText></View>}
          {ambientEvent === 'treasure' && <View pointerEvents="none" style={styles.treasure}><View style={styles.treasureLid} /><View style={styles.treasureBox} /><PixelText style={styles.treasureLabel}>UNEXPLAINED ASSETS</PixelText></View>}

          <View pointerEvents="none" style={styles.timeBadge}><Ionicons name={isNight ? 'moon' : 'sunny'} size={10} color={isNight ? '#B9C8FF' : colors.gold} /><PixelText style={styles.timeText}>{isNight ? 'NIGHT DESK' : 'DAY SESSION'}</PixelText></View>
        </View>

        <View style={styles.productionBar} accessibilityLabel={tankFull ? 'Tank full' : `Next shrimp in ${nextHatch} seconds`}>
          <View style={[styles.liveDot, health < 65 && styles.liveDotDanger]} />
          <PixelText style={styles.productionLabel}>{tankFull ? 'TANK FULL — SELL OR EXPAND' : `AUTO-HATCH IN ${nextHatch}s`}</PixelText>
          <PixelText style={[styles.productionRate, conditionRate < 80 && styles.productionRateDanger]}>OPS {conditionRate}%</PixelText>
        </View>
        <TankConditionPanel state={state} onFeed={handleFeed} onService={service} />

        <View style={styles.speciesHeading}><View><PixelText style={styles.sectionTitle}>CURRENT STOCK</PixelText><PixelText style={styles.holdHint}>HOLD A SHRIMP CARD TO INSPECT IT</PixelText></View><PixelText style={styles.rarity}>{current.rarity.toUpperCase()}</PixelText></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.speciesRow}>
          {species.map((item) => {
            const locked = item.unlockLevel > state.level;
            const acc = state.shrimpAccessories[item.id] ?? { chain: 0, crown: 0, visor: 0 };
            const accessory = acc.visor > 0 ? 'visor' : acc.crown > 0 ? 'crown' : acc.chain > 0 ? 'chain' : undefined;
            return <Pressable accessibilityRole="button" accessibilityState={{ disabled: locked, selected: state.selectedSpecies === item.id }} key={item.id} disabled={locked} onLongPress={() => setInspectId(item.id)} delayLongPress={350} onPress={() => selectSpecies(item.id)} style={({ pressed }) => [styles.speciesCard, locked && styles.speciesLocked, state.selectedSpecies === item.id && styles.speciesSelected, pressed && !locked && styles.cardPressed]}>
              <PixelShrimp color={item.color} accentColor={item.accentColor} pattern={item.pattern} trait={item.trait} accessory={accessory} size={34 + (item.rarity === 'Exotic' ? 7 : item.rarity === 'Mythic' ? 5 : item.rarity === 'Legendary' ? 3 : 0)} />
              <PixelText style={styles.speciesName}>{item.name}</PixelText><PixelText style={styles.speciesRarity}>{item.rarity.toUpperCase()}</PixelText><PixelText style={styles.speciesValue}>{locked ? `UNLOCK LV. ${item.unlockLevel}` : `$${Math.round(item.basePrice * valueMultiplier(state)).toLocaleString()} ea.`}</PixelText>
              {accessory && <PixelText style={styles.accessoryTag}>{accessory === 'visor' ? 'GREEN VISOR' : accessory.toUpperCase()}</PixelText>}
            </Pressable>;
          })}
        </ScrollView>

        {inspected && <View style={styles.inspector}>
          <Pressable onPress={() => setInspectId(null)} style={styles.inspectClose}><Ionicons name="close" size={15} color={colors.ink} /></Pressable>
          <PixelShrimp color={inspected.color} accentColor={inspected.accentColor} pattern={inspected.pattern} trait={inspected.trait} accessory={inspectAccessory} size={68} />
          <View style={styles.inspectInfo}><PixelText style={styles.inspectKicker}>PERSONNEL FILE</PixelText><PixelText style={styles.inspectName}>{inspected.name}</PixelText><PixelText style={styles.inspectLine}>{inspected.rarity} · Age {1 + inspectSeed % 41} days · {(state.mutations[inspected.id] ?? 0)} mutations</PixelText><PixelText style={styles.inspectLine}>Desk: {['Audit', 'Equities', 'M&A', 'Fixed Income'][inspectSeed % 4]} · Lifetime P&L ${(inspected.basePrice * (2 + inspectSeed % 7)).toLocaleString()}</PixelText></View>
        </View>}

        <View style={styles.sellCard}><View><PixelText style={styles.sellTitle}>Sell one {current.name}</PixelText><PixelText style={styles.sellDetail}>{state.shrimp[current.id] ?? 0} ready · Condition-adjusted quote</PixelText></View><Pressable disabled={(state.shrimp[current.id] ?? 0) < 1} onPress={() => sellOne(current.id)} style={({ pressed }) => [styles.sellButton, (state.shrimp[current.id] ?? 0) < 1 && styles.sellDisabled, pressed && styles.sellPressed]}><Ionicons name="cash" size={18} color={colors.ink} /><PixelText style={styles.sellButtonText}>SELL ${salePrice.toLocaleString()}</PixelText></Pressable></View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 }, content: { padding: 18, paddingBottom: 115, gap: 16 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  eyebrow: { fontSize: 11, color: colors.coral, letterSpacing: 2.4 }, title: { fontSize: 24, marginTop: 3 }, money: { alignItems: 'flex-end', backgroundColor: '#0C313C', borderRadius: 12, paddingVertical: 9, paddingHorizontal: 12, borderWidth: 1, borderColor: '#28515C' }, moneyText: { color: colors.gold, fontSize: 18 }, moneyHint: { color: colors.muted, fontSize: 7, marginTop: 2 },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 }, level: { color: colors.aqua, fontSize: 11 }, xp: { color: colors.muted, fontSize: 9 }, xpTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#1B414B', overflow: 'hidden' }, xpFill: { height: '100%', backgroundColor: colors.aqua },
  tankWrap: { position: 'relative', overflow: 'hidden', borderRadius: 18 }, nightTint: { borderRadius: 18, backgroundColor: '#171A48', opacity: 0.22 }, conditionTint: { borderRadius: 18 }, grime: { position: 'absolute', width: 7, height: 7, borderRadius: 4, backgroundColor: '#A7A75B', opacity: 0.32 }, grimeOne: { left: '14%', top: '31%' }, grimeTwo: { left: '74%', top: '57%', width: 10, height: 5 }, grimeThree: { left: '44%', top: '72%', width: 5, height: 9 },
  ticker: { position: 'absolute', left: 76, right: 74, top: 12, height: 20, backgroundColor: '#071A22DD', borderWidth: 1, borderColor: '#9A7134', justifyContent: 'center', overflow: 'hidden' }, tickerText: { color: colors.gold, fontSize: 5, textAlign: 'center' }, brassPipe: { position: 'absolute', left: 9, top: 80, width: 7, height: 122, backgroundColor: '#B8873C', borderWidth: 2, borderColor: '#67451D' }, brassValve: { position: 'absolute', left: 2, top: 127, width: 22, height: 22, borderRadius: 11, borderWidth: 4, borderColor: '#D6A858' }, valveLineA: { position: 'absolute', width: 15, height: 3, left: 0, top: 6, backgroundColor: '#D6A858' }, valveLineB: { position: 'absolute', width: 3, height: 15, left: 6, top: 0, backgroundColor: '#D6A858' }, offshorePlaque: { position: 'absolute', right: 10, bottom: 45, backgroundColor: '#1E2335CC', borderWidth: 1, borderColor: colors.gold, padding: 5 }, offshoreText: { color: colors.gold, fontSize: 5 },
  frenzyText: { position: 'absolute', top: 40, alignSelf: 'center', color: colors.gold, fontSize: 12, textShadowColor: '#071A22', textShadowRadius: 5 }, foodPellet: { position: 'absolute', width: 5, height: 7, borderRadius: 2, backgroundColor: '#D39551', borderWidth: 1, borderColor: '#6E4927' }, rareCelebration: { position: 'absolute', alignSelf: 'center', top: 88, backgroundColor: '#2D2140DD', borderWidth: 2, borderColor: colors.gold, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 12, alignItems: 'center' }, rareTop: { color: colors.gold, fontSize: 9 }, rareSub: { color: '#F0DCF8', fontSize: 6, marginTop: 4 },
  powerFailure: { backgroundColor: '#02080BCC', alignItems: 'center', justifyContent: 'center' }, inspectionEvent: { position: 'absolute', alignSelf: 'center', top: 89, flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: '#582F28E8', borderWidth: 2, borderColor: colors.coral, padding: 10, borderRadius: 10 }, eventHeadline: { color: colors.cream, fontSize: 9 }, eventSub: { color: '#D7C9B8', fontSize: 6, marginTop: 3 }, visitorFish: { position: 'absolute', top: 105, left: 112, width: 110, height: 46 }, visitorBody: { position: 'absolute', left: 20, top: 4, width: 72, height: 35, borderRadius: 18, backgroundColor: '#315E78', borderWidth: 4, borderColor: '#183B50' }, visitorTail: { position: 'absolute', left: 3, top: 10, width: 28, height: 28, backgroundColor: '#376B87', transform: [{ rotate: '45deg' }] }, visitorEye: { position: 'absolute', right: 25, top: 14, width: 5, height: 5, backgroundColor: '#F5F2D5', borderRadius: 3 }, visitorLabel: { position: 'absolute', top: 151, alignSelf: 'center', color: '#A8D8F0', fontSize: 6, backgroundColor: '#071A22AA', padding: 4 }, treasure: { position: 'absolute', right: 84, bottom: 35, alignItems: 'center' }, treasureLid: { width: 31, height: 9, borderWidth: 3, borderColor: '#543416', backgroundColor: '#B27B35' }, treasureBox: { width: 35, height: 20, borderWidth: 3, borderColor: '#543416', backgroundColor: '#8C5E2C' }, treasureLabel: { color: colors.gold, fontSize: 5, marginTop: 2, backgroundColor: '#071A22AA', padding: 3 },
  timeBadge: { position: 'absolute', left: 12, top: 12, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#071A22AA', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 5 }, timeText: { color: '#D5E7E8', fontSize: 6 }, productionBar: { marginTop: -7, backgroundColor: '#0C313C', borderRadius: 10, paddingVertical: 9, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderColor: '#234B56' }, liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success }, liveDotDanger: { backgroundColor: colors.coral }, productionLabel: { color: colors.aqua, fontSize: 9, flex: 1 }, productionRate: { color: colors.muted, fontSize: 8 }, productionRateDanger: { color: colors.coral },
  speciesHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, sectionTitle: { fontSize: 13, letterSpacing: 1.5 }, holdHint: { color: colors.muted, fontSize: 6, marginTop: 4 }, rarity: { fontSize: 9, color: colors.coral }, speciesRow: { gap: 10 }, speciesCard: { width: 134, minHeight: 130, padding: 12, borderRadius: 14, backgroundColor: colors.panel, borderWidth: 2, borderColor: '#23515C', borderBottomWidth: 4 }, speciesLocked: { opacity: 0.42 }, speciesSelected: { borderColor: colors.coral, backgroundColor: '#184955' }, cardPressed: { transform: [{ translateY: 2 }], borderBottomWidth: 2 }, speciesName: { fontSize: 11, marginTop: 7 }, speciesRarity: { color: colors.aqua, fontSize: 7, marginTop: 5 }, speciesValue: { color: colors.gold, fontSize: 9, marginTop: 5 }, accessoryTag: { color: '#A6E8B6', fontSize: 5, marginTop: 5 },
  inspector: { backgroundColor: colors.cream, borderRadius: 15, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 11, position: 'relative' }, inspectClose: { position: 'absolute', right: 8, top: 8, zIndex: 3, padding: 5 }, inspectInfo: { flex: 1, paddingRight: 18 }, inspectKicker: { color: '#758485', fontSize: 6, letterSpacing: 1.2 }, inspectName: { color: colors.ink, fontSize: 15, marginTop: 3 }, inspectLine: { color: '#4F686B', fontSize: 7, lineHeight: 11, marginTop: 4 },
  sellCard: { backgroundColor: colors.cream, borderRadius: 16, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, sellTitle: { color: colors.ink, fontSize: 13 }, sellDetail: { color: '#4B666A', fontSize: 8, marginTop: 4 }, sellButton: { backgroundColor: colors.gold, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6, borderBottomWidth: 4, borderBottomColor: '#B17C24' }, sellButtonText: { color: colors.ink, fontSize: 10 }, sellDisabled: { opacity: 0.35 }, sellPressed: { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
});
