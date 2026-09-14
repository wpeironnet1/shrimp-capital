import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { colors } from '../theme/colors';

export function PixelText({ style, ...props }: TextProps) {
  return <Text {...props} allowFontScaling={false} style={[styles.text, style]} />;
}

const styles = StyleSheet.create({
  text: {
    color: colors.cream,
    fontFamily: 'VT323',
    fontWeight: '400',
    letterSpacing: 0.7,
    textShadowColor: '#02090DDD',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});
