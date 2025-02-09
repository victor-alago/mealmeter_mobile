import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface TabControlProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabControl = ({ tabs, activeTab, onTabChange }: TabControlProps) => {
  const colorScheme = useColorScheme();
  const activeColor = Colors[colorScheme].tint;

  return (
    <View style={styles.container}>
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
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 