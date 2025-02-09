import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Text,
  View,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'text';
  children?: React.ReactNode;
  title?: string;
  titleStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({ 
  children, 
  title, 
  variant = 'primary', 
  style,
  titleStyle,
  disabled,
  icon,
  ...props 
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Render children with explicit text handling
  const renderChildren = () => {
    if (!children) return null;

    // If children is a string, wrap in Text
    if (typeof children === 'string') {
      return (
        <Text 
          style={[
            styles.buttonText, 
            { 
              color: variant === 'primary' ? 'white' : 
                     variant === 'secondary' ? colors.tint : 
                     colors.text 
            },
            titleStyle
          ]}
        >
          {children}
        </Text>
      );
    }

    // If children is an array, map and wrap strings
    if (Array.isArray(children)) {
      return children.map((child, index) => 
        typeof child === 'string' ? (
          <Text 
            key={index}
            style={[
              styles.buttonText, 
              { 
                color: variant === 'primary' ? 'white' : 
                       variant === 'secondary' ? colors.tint : 
                       colors.text 
              },
              titleStyle
            ]}
          >
            {child}
          </Text>
        ) : (
          child
        )
      );
    }

    // For other types, return as-is
    return children;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: variant === 'primary' ? colors.tint : 
                           variant === 'secondary' ? 'transparent' : 'transparent',
          borderColor: colors.tint,
          borderWidth: variant === 'secondary' ? 1 : 0,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      disabled={disabled}
      {...props}
    >
      <View style={styles.buttonContent}>
        {icon}
        {title && (
          <Text 
            style={[
              styles.buttonText, 
              { 
                color: variant === 'primary' ? 'white' : 
                       variant === 'secondary' ? colors.tint : 
                       colors.text 
              },
              titleStyle
            ]}
          >
            {title}
          </Text>
        )}
        {renderChildren()}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});