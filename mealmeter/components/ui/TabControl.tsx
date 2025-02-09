import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from './ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface TabControlProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  style?: ViewStyle;
}

export const TabControl = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  style 
}: TabControlProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;

  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tabButton,
            activeTab === tab && { borderBottomColor: activeColor, borderBottomWidth: 2 }
          ]}
          onPress={() => onTabChange(tab)}
        >
          <ThemedText 
            style={[
              styles.tabText,
              activeTab === tab && { color: activeColor }
            ]}
          >
            {tab}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
});