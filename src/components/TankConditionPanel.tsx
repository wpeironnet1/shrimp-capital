import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { GameState, tankHealth } from '../game/engine';
import { colors } from '../theme/colors';
import { PixelText } from './PixelText';

function Gauge({ label, value, suffix = '%', dangerBelow = 55 }: { label: string; value: number; suffix?: string; dangerBelow?: number }) {
  const normalized = suffix === '°F' ? Math.max(0, Math.min(100, 100 - Math.abs(value - 76) * 12)) : Math.max(0, Math.min(100, value));
  const critical = normalized < dangerBelow;
  return (
    <View style={styles.gauge}>
      <View style={styles.gaugeTop}><PixelText style={styles.gaugeLabel}>{label}</PixelText><PixelText style={[styles.gaugeValue, critical && styles.gaugeDanger]}>{Math.round(value)}{suffix}</PixelText></View>
      <View style={styles.track}><View style={[styles.fill, { width: `${normalized}%` as `${number}%` }, critical && styles.fillDanger]} /></View>
    </View>
  );
}

export function TankConditionPanel({ state, onFeed, onService }: { state: GameState; onFeed: () => void; onService: () => void }) {
  const health = tankHealth(state);
  const feedDisabled = state.cash < 2 || state.conditions.feeding >= 98;
  const serviceDisabled = state.cash < 4 || (state.conditions.waterQuality >= 98 && state.conditions.oxygen >= 98);
  const status = health >= 92 ? 'PRISTINE' : health >= 80 ? 'STABLE' : health >= 65 ? 'WATCHLIST' : health >= 45 ? 'DISTRESSED' : 'CRISIS';

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View><PixelText style={styles.kicker}>OPERATIONS DESK</PixelText><PixelText style={styles.title}>Tank Condition</PixelText></View>
        <View style={[styles.statusPill, health < 65 && styles.statusPillDanger]}><View style={[styles.statusDot, health < 65 && styles.statusDotDanger]} /><PixelText style={styles.status}>{status} · {health}</PixelText></View>
      </View>
      <Gauge label="WATER" value={state.conditions.waterQuality} />
      <Gauge label="OXYGEN" value={state.conditions.oxygen} />
      <Gauge label="FEED" value={state.conditions.feeding} />
      <Gauge label="TEMP" value={state.conditions.temperature} suffix="°F" />
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" disabled={feedDisabled} onPress={onFeed} style={({ pressed }) => [styles.action, feedDisabled && styles.disabled, pressed && !feedDisabled && styles.pressed]}>
          <Ionicons name="fish" size={16} color={colors.ink} />
          <View><PixelText style={styles.actionTitle}>FEED</PixelText><PixelText style={styles.actionCost}>$2 · +42 feed</PixelText></View>
        </Pressable>
        <Pressable accessibilityRole="button" disabled={serviceDisabled} onPress={onService} style={({ pressed }) => [styles.action, styles.service, serviceDisabled && styles.disabled, pressed && !serviceDisabled && styles.pressed]}>
          <Ionicons name="water" size={16} color={colors.cream} />
          <View><PixelText style={[styles.actionTitle, styles.serviceText]}>SERVICE</PixelText><PixelText style={[styles.actionCost, styles.serviceCost]}>$4 · water + O₂</PixelText></View>
        </Pressable>
      </View>
      <PixelText style={styles.footer}>Crowding increases operating stress. Filters stabilize water + oxygen, heaters stabilize temperature, and algae reduces feeding demand.</PixelText>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { backgroundColor: '#0C313C', borderRadius: 15, padding: 14, borderWidth: 1, borderColor: '#2B5A65', gap: 9 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }, kicker: { color: colors.aqua, fontSize: 7, letterSpacing: 1.6 }, title: { fontSize: 15, marginTop: 3 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 8, backgroundColor: '#173F3B', borderWidth: 1, borderColor: '#2D695F' }, statusPillDanger: { backgroundColor: '#4A2828', borderColor: '#7E4545' }, statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success }, statusDotDanger: { backgroundColor: colors.coral }, status: { fontSize: 7, color: colors.cream },
  gauge: { gap: 4 }, gaugeTop: { flexDirection: 'row', justifyContent: 'space-between' }, gaugeLabel: { color: colors.muted, fontSize: 7, letterSpacing: 1.2 }, gaugeValue: { color: colors.aqua, fontSize: 8 }, gaugeDanger: { color: colors.coral }, track: { height: 7, borderRadius: 4, backgroundColor: '#173D47', overflow: 'hidden' }, fill: { height: '100%', borderRadius: 4, backgroundColor: colors.aqua }, fillDanger: { backgroundColor: colors.coral },
  actions: { flexDirection: 'row', gap: 8, marginTop: 3 }, action: { flex: 1, minHeight: 47, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: colors.gold, borderRadius: 10, borderBottomWidth: 4, borderBottomColor: '#A77624', paddingHorizontal: 8 }, service: { backgroundColor: '#235D69', borderBottomColor: '#163F47' }, actionTitle: { color: colors.ink, fontSize: 9 }, actionCost: { color: '#66501F', fontSize: 6, marginTop: 2 }, serviceText: { color: colors.cream }, serviceCost: { color: '#A9D8DE' }, disabled: { opacity: 0.35, borderBottomWidth: 1 }, pressed: { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
  footer: { color: colors.muted, fontSize: 7, lineHeight: 12, marginTop: 2 },
});
