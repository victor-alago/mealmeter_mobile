import React from 'react';
import { TextInput as RNTextInput, TextInputProps, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export function TextInput(props: TextInputProps) {
  const colorScheme = useColorScheme();
  const { style, ...otherProps } = props;

  return (
    <RNTextInput
      style={[
        styles.input,
        {
          color: Colors[colorScheme ?? 'light'].text,
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderColor: Colors[colorScheme ?? 'light'].border,
        },
        style,
      ]}
      placeholderTextColor={Colors[colorScheme ?? 'light'].placeholder}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    height: 50,
    paddingHorizontal: 16,
  },
}); 