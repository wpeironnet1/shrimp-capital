import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { PixelShrimp } from '../components/PixelShrimp';
import { PixelText } from '../components/PixelText';
import { species } from '../game/catalog';
import { useGame } from '../game/GameProvider';
import { BREED_COST, canIPO, currentBiome, projectedIPOShares, totalShrimp } from '../game/engine';
import { colors } from '../theme/colors';

const biomeCopy = {
  'starter-office': { name: 'Bedroom Brokerage', detail: 'Folding desk capital markets. Humble, liquid, slightly damp.', next: 'Trading Floor at Lv. 10' },
  'trading-floor': { name: 'Shell Street Trading Floor', detail: 'Ticker lights, brass pipework, faster-looking money.', next: 'Executive Reef at Lv. 25 or 8 shares' },
  'executive-reef': { name: 'Executive Reef', detail: 'Corner-office coral, premium lighting, institutional shrimp.', next: 'Offshore Fund at Lv. 45 or 25 shares' },
  'offshore-fund': { name: 'Offshore Fund', detail: 'A suspiciously luxurious private reef beyond ordinary regulation.', next: 'Top biome reached' },
};

export function ClanScreen() {
  const { state, breed, ipo, selectSpecies } = useGame();
  const [inspectedId, setInspectedId] = useState(state.selectedSpecies);
  const biome = currentBiome(state);
  const inspected = species.find((item) => item.id === inspectedId) ?? species[0];
  const owned = state.shrimp[inspected.id] ?? 0;
  const mutationCount = state.mutations[inspected.id] ?? 0;
  const discovered = species.filter((item) => (state.shrimp[item.id] ?? 0) > 0 || (state.mutations[item.id] ?? 0) > 0 || item.id === 'cherry');
  const collectionPct = Math.round(discovered.length / species.length * 100);
  const accessories = state.shrimpAccessories[inspected.id] ?? { chain: 0, crown: 0, visor: 0 };
  const inspection = useMemo(() => {
    const seed = inspected.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) + state.stats.hatched;
    return {
      age: 1 + seed % 47,
      earnings: Math.round(inspected.basePrice * (1 + (seed % 9) / 10)),
      temperament: ['Aggressive allocator', 'Quiet analyst', 'Momentum trader', 'Risk-averse accountant', 'Tiny activist investor'][seed % 5],
      desk: ['M&A', 'Fixed Income', 'Equities', 'Audit', 'Commodities'][seed % 5],
    };
  }, [inspected, state.stats.hatched]);
  const canBreed = (state.shrimp[state.selectedSpecies] ?? 0) >= 2 && state.cash >= BREED_COST && totalShrimp(state) < state.tankCapacity;

  return (
    <LinearGradient colors={[colors.ink, colors.deep]} style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PixelText style={styles.eyebrow}>EXECUTIVE CONTROL</PixelText><PixelText style={styles.title}>The Boardroom</PixelText>

        {state.activeMarketEvent && <View style={[styles.eventCard, state.activeMarketEvent.multiplier < 1 && styles.eventDown]}>
          <View style={styles.row}><Ionicons name={state.activeMarketEvent.multiplier >= 1 ? 'trending-up' : 'trending-down'} size={22} color={state.activeMarketEvent.multiplier >= 1 ? colors.success : colors.coral} /><View style={styles.flex}><PixelText style={styles.cardKicker}>LIVE MARKET EVENT</PixelText><PixelText style={styles.eventTitle}>{state.activeMarketEvent.name}</PixelText></View><PixelText style={[styles.multiplier, state.activeMarketEvent.multiplier < 1 && styles.multiplierDown]}>{state.activeMarketEvent.multiplier.toFixed(2)}×</PixelText></View>
          <PixelText style={styles.body}>{state.activeMarketEvent.detail}</PixelText>
        </View>}

        <View style={styles.card}>
          <View style={styles.rowBetween}><View><PixelText style={styles.cardKicker}>TANK REAL ESTATE</PixelText><PixelText style={styles.cardTitle}>{biomeCopy[biome].name}</PixelText></View><Ionicons name="business" size={24} color={colors.gold} /></View>
          <PixelText style={styles.body}>{biomeCopy[biome].detail}</PixelText>
          <View style={styles.track}><View style={[styles.trackFill, { width: `${Math.min(100, biome === 'starter-office' ? state.level / 10 * 100 : biome === 'trading-floor' ? state.level / 25 * 100 : biome === 'executive-reef' ? state.level / 45 * 100 : 100)}%` }]} /></View>
          <PixelText style={styles.hint}>{biomeCopy[biome].next}</PixelText>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}><View><PixelText style={styles.cardKicker}>GENETICS DESK</PixelText><PixelText style={styles.cardTitle}>Breeding & Mutations</PixelText></View><View style={styles.statPill}><PixelText style={styles.statPillText}>{state.stats.mutations} MUTATIONS</PixelText></View></View>
          <PixelText style={styles.body}>Breed two of the selected species for a new shrimp. Roughly 1 in 18 breeds creates a mutation collectible and bonus XP.</PixelText>
          <View style={styles.breedRow}><PixelShrimp color={species.find((x) => x.id === state.selectedSpecies)?.color ?? '#FF6B5E'} accentColor={species.find((x) => x.id === state.selectedSpecies)?.accentColor} pattern={species.find((x) => x.id === state.selectedSpecies)?.pattern} trait={species.find((x) => x.id === state.selectedSpecies)?.trait} size={48} /><View style={styles.flex}><PixelText style={styles.breedName}>{species.find((x) => x.id === state.selectedSpecies)?.name}</PixelText><PixelText style={styles.hint}>{state.shrimp[state.selectedSpecies] ?? 0} owned · ${BREED_COST} lab fee</PixelText></View><Pressable disabled={!canBreed} onPress={breed} style={({ pressed }) => [styles.primaryButton, !canBreed && styles.disabled, pressed && styles.pressed]}><PixelText style={styles.primaryButtonText}>BREED</PixelText></Pressable></View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}><View><PixelText style={styles.cardKicker}>COLLECTION BOOK</PixelText><PixelText style={styles.cardTitle}>{discovered.length}/{species.length} Species · {collectionPct}%</PixelText></View><Ionicons name="book" size={23} color={colors.aqua} /></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.collectionRow}>
            {species.map((item) => {
              const found = discovered.some((entry) => entry.id === item.id);
              return <Pressable key={item.id} disabled={!found} onPress={() => { setInspectedId(item.id); selectSpecies(item.id); }} style={[styles.collectible, !found && styles.unknown, inspectedId === item.id && styles.selected]}>
                {found ? <PixelShrimp color={item.color} accentColor={item.accentColor} pattern={item.pattern} trait={item.trait} size={34} /> : <PixelText style={styles.silhouette}>?</PixelText>}
                <PixelText style={styles.collectibleName}>{found ? item.name.split(' ')[0] : 'UNKNOWN'}</PixelText>
                {state.mutations[item.id] > 0 && <PixelText style={styles.mutationTag}>MUT ×{state.mutations[item.id]}</PixelText>}
              </Pressable>;
            })}
          </ScrollView>
        </View>

        <View style={styles.inspectCard}>
          <View style={styles.inspectHero}>
            <PixelShrimp color={inspected.color} accentColor={inspected.accentColor} pattern={inspected.pattern} trait={inspected.trait} accessory={accessories.visor > 0 ? 'visor' : accessories.crown > 0 ? 'crown' : accessories.chain > 0 ? 'chain' : undefined} size={72} />
            <View style={styles.flex}><PixelText style={styles.cardKicker}>SHRIMP PERSONNEL FILE</PixelText><PixelText style={styles.inspectTitle}>{inspected.name}</PixelText><PixelText style={styles.rarity}>{inspected.rarity.toUpperCase()}</PixelText></View>
          </View>
          <View style={styles.dataGrid}>
            <Data label="OWNED" value={`${owned}`} /><Data label="AGE" value={`${inspection.age} days`} /><Data label="DESK" value={inspection.desk} /><Data label="LIFETIME P&L" value={`$${inspection.earnings}`} /><Data label="PERSONALITY" value={inspection.temperament} /><Data label="ACCESSORIES" value={`${accessories.chain + accessories.crown + accessories.visor}`} />
          </View>
          {mutationCount > 0 && <View style={styles.mutationBanner}><PixelText style={styles.mutationBannerText}>✦ MUTATION LINEAGE ×{mutationCount}</PixelText></View>}
        </View>

        <View style={[styles.card, styles.ipoCard]}>
          <View style={styles.rowBetween}><View><PixelText style={styles.cardKicker}>PRESTIGE</PixelText><PixelText style={styles.cardTitle}>Float Shrimp Capital</PixelText></View><PixelText style={styles.shareCount}>{state.prestigeShares} SHARES</PixelText></View>
          <PixelText style={styles.body}>IPO resets the operating company but awards permanent founder shares. Each share permanently boosts future production and value by 2.5%.</PixelText>
          <View style={styles.ipoMetrics}><Data label="REQUIRES" value="Lv. 10 + $10k revenue" /><Data label="NEXT IPO" value={`+${projectedIPOShares(state)} shares`} /><Data label="IPOs" value={`${state.ipoCount}`} /></View>
          <Pressable disabled={!canIPO(state)} onPress={ipo} style={({ pressed }) => [styles.ipoButton, !canIPO(state) && styles.disabled, pressed && styles.pressed]}><PixelText style={styles.ipoButtonText}>{canIPO(state) ? 'RING THE BELL — GO PUBLIC' : 'NOT IPO-READY'}</PixelText></Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function Data({ label, value }: { label: string; value: string }) { return <View style={styles.data}><PixelText style={styles.dataLabel}>{label}</PixelText><PixelText style={styles.dataValue}>{value}</PixelText></View>; }

const styles = StyleSheet.create({
  page: { flex: 1 }, content: { padding: 20, paddingBottom: 120, gap: 14 }, eyebrow: { color: colors.coral, fontSize: 9, letterSpacing: 2.2, marginTop: 7 }, title: { fontSize: 29, marginTop: 4, marginBottom: 3 },
  card: { backgroundColor: colors.panel, borderRadius: 16, padding: 15, borderWidth: 1, borderBottomWidth: 4, borderColor: '#2A5D68', borderBottomColor: '#09232B' }, cardKicker: { color: colors.aqua, fontSize: 7, letterSpacing: 1.5 }, cardTitle: { fontSize: 16, marginTop: 4 }, body: { color: colors.muted, fontSize: 8, lineHeight: 13, marginTop: 8 }, hint: { color: colors.muted, fontSize: 7, marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 }, rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, flex: { flex: 1 },
  eventCard: { backgroundColor: '#173E34', borderRadius: 16, padding: 15, borderWidth: 2, borderColor: '#3E7B60' }, eventDown: { backgroundColor: '#43262A', borderColor: '#82474F' }, eventTitle: { fontSize: 13, marginTop: 3 }, multiplier: { color: colors.success, fontSize: 18 }, multiplierDown: { color: colors.coral },
  track: { height: 7, backgroundColor: '#173943', borderRadius: 4, overflow: 'hidden', marginTop: 11 }, trackFill: { height: '100%', backgroundColor: colors.gold }, statPill: { backgroundColor: '#263F52', borderRadius: 8, padding: 7 }, statPillText: { color: '#C6D9FF', fontSize: 7 },
  breedRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, backgroundColor: colors.deep, borderRadius: 12, padding: 10 }, breedName: { fontSize: 11 }, primaryButton: { backgroundColor: colors.gold, borderRadius: 8, borderBottomWidth: 4, borderBottomColor: '#A77820', paddingVertical: 10, paddingHorizontal: 12 }, primaryButtonText: { color: colors.ink, fontSize: 8 }, disabled: { opacity: 0.32, borderBottomWidth: 1 }, pressed: { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
  collectionRow: { gap: 7, marginTop: 12 }, collectible: { width: 83, minHeight: 83, borderRadius: 10, backgroundColor: colors.deep, borderWidth: 2, borderColor: '#23515C', alignItems: 'center', justifyContent: 'center', padding: 7 }, unknown: { opacity: 0.32 }, selected: { borderColor: colors.gold }, silhouette: { fontSize: 25, color: '#365660' }, collectibleName: { fontSize: 6, color: colors.muted, marginTop: 6, textAlign: 'center' }, mutationTag: { color: '#D39CFF', fontSize: 5, marginTop: 3 },
  inspectCard: { backgroundColor: '#EDE1C1', borderRadius: 16, padding: 15, borderWidth: 2, borderColor: '#C2AA76' }, inspectHero: { flexDirection: 'row', gap: 12, alignItems: 'center' }, inspectTitle: { color: colors.ink, fontSize: 17, marginTop: 3 }, rarity: { color: '#8C5B2A', fontSize: 7, marginTop: 4 }, dataGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 12 }, data: { minWidth: '29%', flexGrow: 1, backgroundColor: '#FFF4D6', borderRadius: 8, padding: 8 }, dataLabel: { color: '#708086', fontSize: 5 }, dataValue: { color: colors.ink, fontSize: 7, marginTop: 3, maxWidth: 120 }, mutationBanner: { marginTop: 9, backgroundColor: '#5B3972', borderRadius: 7, padding: 8 }, mutationBannerText: { color: '#F1C7FF', fontSize: 7, textAlign: 'center' },
  ipoCard: { backgroundColor: '#292342', borderColor: '#665A9D' }, shareCount: { color: colors.gold, fontSize: 10 }, ipoMetrics: { flexDirection: 'row', gap: 6, marginTop: 11 }, ipoButton: { backgroundColor: colors.coral, borderRadius: 10, borderBottomWidth: 4, borderBottomColor: colors.coralDark, padding: 13, marginTop: 12, alignItems: 'center' }, ipoButtonText: { color: colors.white, fontSize: 9 },
});
