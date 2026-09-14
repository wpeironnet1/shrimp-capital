import React from 'react';
import { Platform, StyleSheet, Text, TextProps } from 'react-native';
import { colors } from '../theme/colors';

export function PixelText({ style, ...props }: TextProps) {
  return <Text {...props} allowFontScaling={false} style={[styles.text, style]} />;
}

const styles = StyleSheet.create({
  text: {
    color: colors.cream,
    fontFamily: Platform.select({ web: 'monospace', ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    fontWeight: '800',
    letterSpacing: 0.55,
    textShadowColor: '#02090DCC',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});
