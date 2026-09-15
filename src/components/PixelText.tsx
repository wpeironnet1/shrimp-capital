import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { colors } from '../theme/colors';

export function PixelText({ style, ...props }: TextProps) {
  const flattened = StyleSheet.flatten(style) ?? {};
  const requestedSize = typeof flattened.fontSize === 'number' ? flattened.fontSize : 15;
  const isDisplayPixel = flattened.fontFamily === 'PressStart2P';
  // PressStart2P becomes difficult to scan below 12px on phone-density screens.
  // VT323 is intentionally airy, so 15px is a better practical body-text floor.
  const minimumSize = isDisplayPixel ? 12 : 15;
  const fontSize = Math.max(minimumSize, requestedSize);
  const requestedLineHeight = typeof flattened.lineHeight === 'number' ? flattened.lineHeight : undefined;
  const minimumLineHeight = isDisplayPixel ? fontSize + 7 : fontSize + 5;
  const lineHeight = requestedLineHeight ? Math.max(requestedLineHeight, minimumLineHeight) : minimumLineHeight;

  return (
    <Text
      {...props}
      allowFontScaling
      maxFontSizeMultiplier={1.5}
      style={[styles.text, style, { fontSize, lineHeight }]}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.cream,
    fontFamily: 'VT323',
    fontWeight: '400',
    letterSpacing: 0.08,
    textShadowColor: '#010609',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});
