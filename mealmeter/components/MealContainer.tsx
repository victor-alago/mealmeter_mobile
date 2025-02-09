// File: /Users/Tin1/Downloads/Mealmeter/mealmeter_mobile/mealmeter/components/MealContainer.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface MealContainerProps {
  mealType: string;
  meals: any[];
}

export function MealContainer({ mealType, meals }: MealContainerProps) {
  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return 'sunny';
      case 'lunch': return 'partly-sunny';
      case 'dinner': return 'moon';
      case 'snacks': return 'nutrition';
      case 'drinks': return 'water';
      default: return 'restaurant';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons 
          name={getMealIcon(mealType)} 
          size={24} 
          color={Colors.light.tint} 
        />
        <Text style={styles.mealTypeText}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>
      </View>
      {meals.length === 0 ? (
        <Text style={styles.noMealsText}>No meals logged</Text>
      ) : (
        meals.map((meal, index) => (
          <View key={index} style={styles.mealItem}>
            <Text style={styles.mealName}>{meal.food_name}</Text>
            <Text style={styles.mealCalories}>{meal.calories} cal</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealItem: {
    borderBottomColor: Colors.light.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  mealName: {
    fontSize: 16,
  },
  mealTypeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  noMealsText: {
    color: Colors.light.secondaryText,
    textAlign: 'center',
  },
});