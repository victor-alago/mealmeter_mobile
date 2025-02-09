// File: /Users/Tin1/Downloads/Mealmeter/mealmeter_mobile/mealmeter/components/CalorieProgress.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface CalorieProgressProps {
  totalCalories?: number;
  targetCalories?: number;
  remainingCalories?: number;
  style?: ViewStyle;
}

export function CalorieProgress({ 
  totalCalories = 0, 
  targetCalories = 2000, 
  remainingCalories,
  style 
}: CalorieProgressProps) {
  // More robust null and type checking
  const safeTotal = typeof totalCalories === 'number' ? totalCalories : 0;
  const safeTarget = typeof targetCalories === 'number' ? targetCalories : 2000;
  const safeRemaining = typeof remainingCalories === 'number' 
    ? remainingCalories 
    : Math.max(0, safeTarget - safeTotal);

  const percentage = Math.min(100, (safeTotal / safeTarget) * 100);
  const goalMet = safeTotal >= safeTarget;

  // Render nothing if both calories are zero or invalid
  if (safeTotal === 0 && safeTarget === 2000) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.progressContainer}>
        <View style={styles.progressContent}>
          <Text style={styles.remainingText}>{safeRemaining}</Text>
          <Text style={styles.remainingSubtext}>
            {goalMet ? "Goal achieved!" : "remaining"}
          </Text>
        </View>
      </View>
      
      <View style={styles.caloriesInfo}>
        <View style={styles.goalInfo}>
          <Ionicons 
            name="fitness" 
            size={30} 
            color="white" 
          />
          <View style={styles.goalTextContainer}>
            <Text style={styles.goalLabel}>Base Goal</Text>
            <Text style={styles.goalValue}>{safeTarget}</Text>
          </View>
        </View>
        
        <View style={styles.goalInfo}>
          <Ionicons 
            name="flame" 
            size={30} 
            color="white" 
          />
          <View style={styles.goalTextContainer}>
            <Text style={styles.goalLabel}>Total</Text>
            <Text style={styles.goalValue}>{safeTotal}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  caloriesInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 16,
  },
  goalInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  goalLabel: {
    color: 'white',
    fontSize: 12,
    opacity: 0.7,
  },
  goalTextContainer: {
    flexDirection: 'column',
  },
  goalValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  progressContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingSubtext: {
    color: 'white',
    fontSize: 16,
  },
  remainingText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  }
});