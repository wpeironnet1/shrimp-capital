import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { colors } from '../theme/colors';

export function PixelText({ style, ...props }: TextProps) {
  const flattened = StyleSheet.flatten(style) ?? {};
  const requestedSize = typeof flattened.fontSize === 'number' ? flattened.fontSize : 10;
  const fontSize = Math.max(9, requestedSize);
  const requestedLineHeight = typeof flattened.lineHeight === 'number' ? flattened.lineHeight : undefined;
  const lineHeight = requestedLineHeight ? Math.max(requestedLineHeight, fontSize + 3) : undefined;

  return (
    <Text
      {...props}
      allowFontScaling
      maxFontSizeMultiplier={1.2}
      style={[styles.text, style, { fontSize, lineHeight }]}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.cream,
    fontFamily: 'VT323',
    fontWeight: '400',
    letterSpacing: 0.35,
    textShadowColor: '#02090DDD',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});
