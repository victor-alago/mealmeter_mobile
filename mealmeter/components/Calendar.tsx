// File: /Users/Tin1/Downloads/Mealmeter/mealmeter_mobile/mealmeter/components/Calendar.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { API_URL } from '@/config/api';
import { getAuthToken } from '@/utils/secureStorage';
import { CalorieProgress } from '@/components/CalorieProgress';
import { MealContainer } from '@/components/MealContainer';

const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface CalendarProps {
  profileComplete: boolean;
}

export function Calendar({ profileComplete }: CalendarProps) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [baseDate, setBaseDate] = useState(today);
  const [totalCalories, setTotalCalories] = useState(0);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [isLocked, setIsLocked] = useState(false);
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
    drinks: []
  });

  const navigateDays = (direction: number) => {
    const newDate = new Date(baseDate);
    newDate.setDate(baseDate.getDate() + direction * 7);
    setBaseDate(newDate);
  };

  const selectDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      setIsLocked(true);
      setTimeout(() => setIsLocked(false), 1000);
    } else {
      setCurrentDate(date);
      setBaseDate(date);
    }
  };

  const daysToShow = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(baseDate);
    day.setDate(baseDate.getDate() - baseDate.getDay() + i);
    return day;
  });

  useEffect(() => {
    const fetchCalories = async () => {
      try {
        const token = await getAuthToken();
        const response = await axios.get(
          `${API_URL}/food-log/daily/${currentDate.toISOString().split('T')[0]}`, 
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (response.data) {
          setTotalCalories(response.data.total_calories);
          setTargetCalories(response.data.target_calories);
          setMeals(response.data.meals);
        }
      } catch (error) {
        console.error('Failed to fetch calorie data:', error);
      }
    };

    fetchCalories();
  }, [currentDate]);

  return (
    <View style={styles.container}>
      <View style={styles.dateNavigation}>
        <TouchableOpacity onPress={() => navigateDays(-1)}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {daysToShow[0].toLocaleString('default', { month: 'long' })} {daysToShow[0].getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => navigateDays(1)}>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysContainer}>
        {daysToShow.map((day, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.dayButton, 
              currentDate.toDateString() === day.toDateString() && styles.selectedDay
            ]}
            onPress={() => selectDate(day)}
          >
            <Text style={styles.dayText}>{days[day.getDay()]}</Text>
            <Text style={styles.dateText}>{day.getDate()}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <CalorieProgress 
        totalCalories={totalCalories} 
        targetCalories={targetCalories} 
      />

      <View style={styles.mealsContainer}>
        {Object.entries(meals).map(([mealType, mealItems]) => (
          <MealContainer 
            key={mealType} 
            mealType={mealType} 
            meals={mealItems} 
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  dateNavigation: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayButton: {
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    padding: 10,
  },
  dayText: {
    color: 'white',
    fontSize: 12,
  },
  daysContainer: {
    marginBottom: 16,
  },
  mealsContainer: {
    marginTop: 16,
  },
  monthText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedDay: {
    backgroundColor: Colors.light.tint,
  },
});