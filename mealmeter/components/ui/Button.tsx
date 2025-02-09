import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
  Text,
  TextStyle,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary';
  children?: React.ReactNode;
  title?: string;
  titleStyle?: TextStyle;
}

export function Button({ 
  children, 
  title, 
  variant = 'primary', 
  style,
  titleStyle,
  disabled,
  ...props 
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: variant === 'primary' ? colors.tint : 'transparent',
          borderColor: colors.tint,
          borderWidth: variant === 'secondary' ? 1 : 0,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      disabled={disabled}
      {...props}
    >
      {title && (
        <Text style={[styles.buttonText, titleStyle]}>
          {title}
        </Text>
      )}
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});