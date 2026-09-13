import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { PixelText } from './PixelText';

export function OfflineReport({ amount, onClose }: { amount: number; onClose: () => void }) {
  return (
    <Modal transparent visible={amount > 0} animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card} accessibilityRole="alert">
          <View style={styles.icon}><Ionicons name="moon" size={26} color={colors.gold} /></View>
          <PixelText style={styles.eyebrow}>WHILE YOU WERE AWAY</PixelText>
          <PixelText style={styles.title}>The tank stayed busy.</PixelText>
          <PixelText style={styles.amount}>+{amount} shrimp</PixelText>
          <PixelText style={styles.body}>Your tiny aquatic workforce kept compounding without supervision.</PixelText>
          <Pressable accessibilityRole="button" accessibilityLabel="Collect offline shrimp" onPress={onClose} style={styles.button}>
            <PixelText style={styles.buttonText}>COLLECT THE DIVIDENDS</PixelText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(2, 13, 18, 0.82)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  card: { width: '100%', maxWidth: 390, backgroundColor: colors.panel, borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 2, borderColor: '#346875' },
  icon: { width: 54, height: 54, borderRadius: 18, backgroundColor: colors.deep, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  eyebrow: { color: colors.aqua, fontSize: 9, letterSpacing: 2 }, title: { fontSize: 23, marginTop: 7 }, amount: { color: colors.gold, fontSize: 31, marginTop: 18 },
  body: { color: colors.muted, fontSize: 11, lineHeight: 18, textAlign: 'center', marginTop: 10, maxWidth: 270 },
  button: { width: '100%', backgroundColor: colors.coral, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 22 }, buttonText: { color: colors.white, fontSize: 10, letterSpacing: 1 },
});
