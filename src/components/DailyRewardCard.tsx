import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { canClaimDailyReward, dailyRewardAmount, GameState, nextDailyStreak } from '../game/engine';
import { colors } from '../theme/colors';
import { PixelText } from './PixelText';

export function DailyRewardCard({ state, onClaim }: { state: GameState; onClaim: () => void }) {
  const available = canClaimDailyReward(state);
  const nextStreak = available ? nextDailyStreak(state) : state.dailyStreak;
  const reward = dailyRewardAmount(nextStreak);
  return (
    <View style={styles.card} accessibilityLabel={available ? `Daily reward available. Day ${nextStreak}, ${reward} dollars.` : `Daily reward collected. ${state.dailyStreak} day streak.`}>
      <View style={styles.icon}><Ionicons name={available ? 'sunny' : 'checkmark'} size={20} color={available ? colors.gold : colors.success} /></View>
      <View style={styles.copy}><PixelText style={styles.kicker}>MARKET OPEN</PixelText><PixelText style={styles.title}>{available ? `Day ${nextStreak} reward` : `${state.dailyStreak}-day streak secured`}</PixelText><PixelText style={styles.detail}>{available ? `Collect $${reward} in daily capital` : 'Come back tomorrow for the next allocation'}</PixelText></View>
      {available && <Pressable accessibilityRole="button" accessibilityLabel={`Claim ${reward} dollar daily reward`} onPress={onClaim} style={styles.claim}><PixelText style={styles.claimText}>CLAIM</PixelText></Pressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#2D304A', borderRadius: 14, padding: 13, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#55577A' },
  icon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#171C35', alignItems: 'center', justifyContent: 'center' }, copy: { flex: 1, marginLeft: 11 },
  kicker: { color: '#B7B9E8', fontSize: 7, letterSpacing: 1.5 }, title: { fontSize: 12, marginTop: 3 }, detail: { color: colors.muted, fontSize: 8, marginTop: 4 },
  claim: { backgroundColor: colors.gold, borderRadius: 9, paddingVertical: 10, paddingHorizontal: 11 }, claimText: { color: colors.ink, fontSize: 9 },
});
