import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { PixelText } from '../components/PixelText';
import { upgrades } from '../game/catalog';
import { useGame } from '../game/GameProvider';
import { tankHealth, upgradeCost } from '../game/engine';
import { colors } from '../theme/colors';

const upgradeImpact: Record<string, string> = {
  filter: 'Cleaner water · stronger oxygen · +20% production',
  heater: 'Stabler temperature · +15% hatch speed',
  algae: 'Less feeding pressure · +25% sale value',
};

export function MarketScreen() {
  const { state, buyUpgrade, expandTank } = useGame();
  const tankCost = Math.round(75 * Math.pow(1.45, Math.max(0, (state.tankCapacity - 20) / 10)));
  const health = tankHealth(state);
  return (
    <LinearGradient colors={[colors.ink, colors.deep]} style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <PixelText style={styles.eyebrow}>REINVEST YOUR GAINS</PixelText><PixelText style={styles.title}>The Shrimp Exchange</PixelText>
        <View style={styles.balance}><View><PixelText style={styles.balanceLabel}>BUYING POWER</PixelText><PixelText style={styles.balanceSub}>OPERATIONS HEALTH {health}/100</PixelText></View><PixelText style={styles.balanceValue}>${state.cash.toLocaleString()}</PixelText></View>
        <PixelText style={styles.section}>OPERATIONS</PixelText>
        {upgrades.map((item) => {
          const owned = state.upgrades[item.id] ?? 0;
          const cost = upgradeCost(item.baseCost, owned);
          const affordable = state.cash >= cost;
          return <View key={item.id} style={[styles.card, affordable && styles.cardAffordable]}>
            <View style={styles.icon}><Ionicons name={item.icon} size={25} color={colors.aqua} /></View>
            <View style={styles.info}>
              <View style={styles.nameRow}><PixelText style={styles.name}>{item.name}</PixelText>{owned > 0 && <View style={styles.levelBadge}><PixelText style={styles.levelBadgeText}>LV {owned}</PixelText></View>}</View>
              <PixelText style={styles.detail}>{upgradeImpact[item.id] ?? item.detail}</PixelText>
              <View style={styles.pips}>{Array.from({ length: 5 }, (_, index) => <View key={index} style={[styles.pip, index < Math.min(5, owned) && styles.pipActive]} />)}</View>
            </View>
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: !affordable }} disabled={!affordable} onPress={() => buyUpgrade(item.id)} style={({ pressed }) => [styles.buy, !affordable && styles.disabled, pressed && affordable && styles.buyPressed]}>
              <PixelText style={styles.buyHint}>{owned === 0 ? 'INSTALL' : 'UPGRADE'}</PixelText><PixelText style={styles.buyText}>${cost.toLocaleString()}</PixelText>
            </Pressable>
          </View>;
        })}
        <PixelText style={styles.section}>REAL ESTATE</PixelText>
        <View style={[styles.card, state.cash >= tankCost && styles.cardAffordable]}>
          <View style={[styles.icon, styles.realEstateIcon]}><Ionicons name="business" size={25} color={colors.coral} /></View>
          <View style={styles.info}><PixelText style={styles.name}>Tank Expansion</PixelText><PixelText style={styles.detail}>+10 capacity · lowers crowding pressure · Current {state.tankCapacity}</PixelText><View style={styles.capacityTrack}><View style={[styles.capacityFill, { width: `${Math.min(100, state.tankCapacity / 120 * 100)}%` }]} /></View></View>
          <Pressable accessibilityRole="button" accessibilityState={{ disabled: state.cash < tankCost }} disabled={state.cash < tankCost} onPress={expandTank} style={({ pressed }) => [styles.buy, styles.expandBuy, state.cash < tankCost && styles.disabled, pressed && state.cash >= tankCost && styles.buyPressed]}><PixelText style={styles.buyHint}>EXPAND</PixelText><PixelText style={styles.buyText}>${tankCost.toLocaleString()}</PixelText></Pressable>
        </View>
        <View style={styles.premium}><PixelText style={styles.premiumTag}>BOARD MEMO</PixelText><PixelText style={styles.premiumTitle}>CAPEX changes the tank.</PixelText><PixelText style={styles.premiumBody}>Equipment is not just a percentage boost anymore. It reduces operating pressure and keeps production healthy as the shrimp fund scales.</PixelText></View>
      </ScrollView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1 }, content: { padding: 20, paddingBottom: 120 }, eyebrow: { color: colors.coral, fontSize: 10, letterSpacing: 2, marginTop: 5 }, title: { fontSize: 27, marginTop: 5, marginBottom: 18 },
  balance: { padding: 18, backgroundColor: colors.panel, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#285965' }, balanceLabel: { fontSize: 11, color: colors.muted }, balanceSub: { color: colors.aqua, fontSize: 7, marginTop: 5 }, balanceValue: { fontSize: 24, color: colors.gold }, section: { fontSize: 11, letterSpacing: 1.7, marginTop: 24, marginBottom: 9, color: colors.aqua },
  card: { flexDirection: 'row', alignItems: 'center', padding: 13, marginBottom: 9, backgroundColor: colors.panel, borderRadius: 14, borderWidth: 1, borderBottomWidth: 4, borderColor: '#26525C', borderBottomColor: '#09252D' }, cardAffordable: { borderColor: '#39717B' }, icon: { width: 44, height: 44, borderRadius: 11, backgroundColor: colors.deep, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1E5360' }, realEstateIcon: { borderColor: '#6B4540' }, info: { flex: 1, marginLeft: 11, marginRight: 8 }, nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 }, name: { fontSize: 11, flexShrink: 1 }, detail: { color: colors.muted, fontSize: 7, lineHeight: 11, marginTop: 4 },
  levelBadge: { backgroundColor: '#204E58', borderRadius: 5, paddingHorizontal: 5, paddingVertical: 3 }, levelBadgeText: { color: colors.aqua, fontSize: 6 }, pips: { flexDirection: 'row', gap: 3, marginTop: 7 }, pip: { width: 13, height: 4, borderRadius: 2, backgroundColor: '#23434B' }, pipActive: { backgroundColor: colors.aqua },
  buy: { minWidth: 70, backgroundColor: colors.gold, borderRadius: 9, paddingVertical: 8, paddingHorizontal: 9, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#A87320' }, expandBuy: { backgroundColor: '#FFB65C' }, buyHint: { color: '#6C501B', fontSize: 6, marginBottom: 2 }, buyText: { color: colors.ink, fontSize: 9 }, buyPressed: { transform: [{ translateY: 2 }], borderBottomWidth: 2 }, disabled: { opacity: 0.3, borderBottomWidth: 1 },
  capacityTrack: { height: 5, borderRadius: 3, backgroundColor: '#23434B', overflow: 'hidden', marginTop: 7 }, capacityFill: { height: '100%', backgroundColor: colors.coral },
  premium: { marginTop: 24, borderRadius: 18, padding: 19, backgroundColor: '#352646', borderWidth: 2, borderColor: '#75599C' }, premiumTag: { color: '#CFB1FF', fontSize: 8, letterSpacing: 1.8 }, premiumTitle: { fontSize: 17, marginTop: 7 }, premiumBody: { color: '#CFBEDA', fontSize: 9, lineHeight: 15, marginTop: 7 }
});
