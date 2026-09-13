import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { missions } from '../game/catalog';
import { GameState } from '../game/engine';
import { colors } from '../theme/colors';
import { PixelText } from './PixelText';

export function MissionPanel({ state, onClaim }: { state: GameState; onClaim: (id: string) => void }) {
  const mission = missions.find((entry) => !state.claimedMissions[entry.id]);
  if (!mission) return <View style={styles.complete}><Ionicons name="trophy" size={20} color={colors.gold} /><View><PixelText style={styles.completeTitle}>OPENING BELL CLEARED</PixelText><PixelText style={styles.detail}>More objectives are coming with the next fund cycle.</PixelText></View></View>;

  const progress = Math.min(mission.target, state.stats[mission.metric]);
  const ready = progress >= mission.target;
  return (
    <View style={styles.card} accessibilityLabel={`${mission.detail}. ${progress} of ${mission.target} complete.`}>
      <View style={styles.heading}><View><PixelText style={styles.kicker}>ACTIVE MANDATE</PixelText><PixelText style={styles.title}>{mission.title}</PixelText></View><PixelText style={styles.reward}>+${mission.reward}</PixelText></View>
      <PixelText style={styles.detail}>{mission.detail} · {progress}/{mission.target}</PixelText>
      <View style={styles.track}><View style={[styles.fill, { width: `${progress / mission.target * 100}%` }]} /></View>
      {ready && <Pressable accessibilityRole="button" onPress={() => onClaim(mission.id)} style={styles.claim}><PixelText style={styles.claimText}>CLAIM MANDATE</PixelText></Pressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#183F49', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#32616B' },
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, kicker: { color: colors.aqua, fontSize: 8, letterSpacing: 1.5 }, title: { fontSize: 13, marginTop: 4 }, reward: { color: colors.gold, fontSize: 15 },
  detail: { color: colors.muted, fontSize: 9, marginTop: 8 }, track: { height: 7, borderRadius: 4, backgroundColor: colors.deep, overflow: 'hidden', marginTop: 10 }, fill: { height: '100%', backgroundColor: colors.coral },
  claim: { backgroundColor: colors.gold, borderRadius: 9, alignItems: 'center', paddingVertical: 10, marginTop: 11 }, claimText: { color: colors.ink, fontSize: 9, letterSpacing: 1 },
  complete: { backgroundColor: '#183F49', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11, borderWidth: 1, borderColor: '#32616B' }, completeTitle: { fontSize: 11, color: colors.gold },
});
