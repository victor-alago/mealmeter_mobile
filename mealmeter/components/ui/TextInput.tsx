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
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
}); 