import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { TouchableOpacity } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { logout } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarButton: HapticTab,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={{ marginRight: 10 }}>
            <IconSymbol name="arrowshape.turn.up.left" color={Colors[colorScheme ?? 'light'].tint} />
          </TouchableOpacity>
        )
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="food-recognition"
        options={{
          title: 'Food Scan',
          tabBarIcon: ({ color }) => <IconSymbol name="camera.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="log_food"
        options={{
          title: 'Log Food',
          tabBarIcon: ({ color }) => <IconSymbol name="plus.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}