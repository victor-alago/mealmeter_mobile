import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface ThemedTextProps extends TextProps {
  lightColor?: string;
  darkColor?: string;
  style?: StyleProp<TextStyle>;
}

export const ThemedText = ({
  lightColor,
  darkColor,
  style,
  ...rest
}: ThemedTextProps) => {
  const colorScheme = useColorScheme();
  const color = colorScheme === 'light' 
    ? lightColor || Colors.light.text 
    : darkColor || Colors.dark.text;

  return <Text style={[{ color }, style]} {...rest} />;
}; 