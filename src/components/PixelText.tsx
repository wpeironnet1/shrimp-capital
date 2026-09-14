import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { colors } from '../theme/colors';

export function PixelText({ style, ...props }: TextProps) {
  const flattened = StyleSheet.flatten(style) ?? {};
  const requestedSize = typeof flattened.fontSize === 'number' ? flattened.fontSize : 12;
  const isDisplayPixel = flattened.fontFamily === 'PressStart2P';
  const minimumSize = isDisplayPixel ? 9 : 11;
  const fontSize = Math.max(minimumSize, requestedSize);
  const requestedLineHeight = typeof flattened.lineHeight === 'number' ? flattened.lineHeight : undefined;
  const lineHeight = requestedLineHeight ? Math.max(requestedLineHeight, fontSize + 5) : fontSize + 5;

  return (
    <Text
      {...props}
      allowFontScaling
      maxFontSizeMultiplier={1.3}
      style={[styles.text, style, { fontSize, lineHeight }]}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.cream,
    fontFamily: 'VT323',
    fontWeight: '400',
    letterSpacing: 0.18,
    textShadowColor: '#010609',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});
