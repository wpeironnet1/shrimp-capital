import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { PixelText } from '../components/PixelText';
import { upgrades } from '../game/catalog';
import { useGame } from '../game/GameProvider';
import { upgradeCost } from '../game/engine';
import { colors } from '../theme/colors';

export function MarketScreen() {
  const { state, buyUpgrade, expandTank } = useGame();
  const tankCost = Math.round(75 * Math.pow(1.45, Math.max(0, (state.tankCapacity - 20) / 10)));
  return (
    <LinearGradient colors={[colors.ink, colors.deep]} style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <PixelText style={styles.eyebrow}>REINVEST YOUR GAINS</PixelText><PixelText style={styles.title}>The Shrimp Exchange</PixelText>
        <View style={styles.balance}><PixelText style={styles.balanceLabel}>BUYING POWER</PixelText><PixelText style={styles.balanceValue}>${state.cash.toLocaleString()}</PixelText></View>
        <PixelText style={styles.section}>OPERATIONS</PixelText>
        {upgrades.map((item) => {
          const owned = state.upgrades[item.id] ?? 0;
          const cost = upgradeCost(item.baseCost, owned);
          return <View key={item.id} style={styles.card}>
            <View style={styles.icon}><Ionicons name={item.icon} size={25} color={colors.aqua} /></View>
            <View style={styles.info}><PixelText style={styles.name}>{item.name}</PixelText><PixelText style={styles.detail}>{item.detail} · Owned {owned}</PixelText></View>
            <Pressable onPress={() => buyUpgrade(item.id)} style={[styles.buy, state.cash < cost && styles.disabled]}><PixelText style={styles.buyText}>${cost}</PixelText></Pressable>
          </View>;
        })}
        <PixelText style={styles.section}>REAL ESTATE</PixelText>
        <View style={styles.card}><View style={styles.icon}><Ionicons name="business" size={25} color={colors.coral} /></View><View style={styles.info}><PixelText style={styles.name}>Tank Expansion</PixelText><PixelText style={styles.detail}>+10 shrimp capacity · Current {state.tankCapacity}</PixelText></View><Pressable onPress={expandTank} style={[styles.buy, state.cash < tankCost && styles.disabled]}><PixelText style={styles.buyText}>${tankCost}</PixelText></Pressable></View>
        <View style={styles.premium}><PixelText style={styles.premiumTag}>COMING LATER</PixelText><PixelText style={styles.premiumTitle}>The Shell Fund™</PixelText><PixelText style={styles.premiumBody}>Optional boosts, cosmetic tanks, and event passes. Core farming stays free.</PixelText></View>
      </ScrollView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({ page: { flex: 1 }, content: { padding: 20, paddingBottom: 120 }, eyebrow: { color: colors.coral, fontSize: 10, letterSpacing: 2, marginTop: 5 }, title: { fontSize: 27, marginTop: 5, marginBottom: 18 }, balance: { padding: 18, backgroundColor: colors.panel, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#285965' }, balanceLabel: { fontSize: 11, color: colors.muted }, balanceValue: { fontSize: 24, color: colors.gold }, section: { fontSize: 11, letterSpacing: 1.7, marginTop: 24, marginBottom: 9, color: colors.aqua }, card: { flexDirection: 'row', alignItems: 'center', padding: 13, marginBottom: 9, backgroundColor: colors.panel, borderRadius: 14, borderWidth: 1, borderColor: '#26525C' }, icon: { width: 44, height: 44, borderRadius: 11, backgroundColor: colors.deep, alignItems: 'center', justifyContent: 'center' }, info: { flex: 1, marginLeft: 11 }, name: { fontSize: 12 }, detail: { color: colors.muted, fontSize: 8, marginTop: 4 }, buy: { backgroundColor: colors.gold, borderRadius: 9, paddingVertical: 9, paddingHorizontal: 10 }, buyText: { color: colors.ink, fontSize: 11 }, disabled: { opacity: 0.35 }, premium: { marginTop: 24, borderRadius: 18, padding: 19, backgroundColor: '#352646', borderWidth: 2, borderColor: '#75599C' }, premiumTag: { color: '#CFB1FF', fontSize: 8, letterSpacing: 1.8 }, premiumTitle: { fontSize: 20, marginTop: 7 }, premiumBody: { color: '#CFBEDA', fontSize: 10, lineHeight: 16, marginTop: 7 } });
