import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { Picker } from '@/components/ui/Picker';
import axios from 'axios';
import { API_URL } from '@/config/api';
import { getAuthToken } from '@/utils/secureStorage';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function LogFoodScreen() {
  const [foodName, setFoodName] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [calories, setCalories] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const clearForm = () => {
    setFoodName('');
    setMealType('breakfast');
    setCalories('');
    setServingSize('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleSubmit = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        Alert.alert('Error', 'No authorization token found');
        return;
      }

      const response = await axios.post(`${API_URL}/food-log/entry`, {
        food_name: foodName,
        meal_type: mealType,
        calories: parseFloat(calories),
        serving_size: servingSize,
        date: date,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      Alert.alert('Success', response.data.message);
      clearForm();
    } catch (error) {
      console.error('Failed to log food entry:', error);
      Alert.alert('Error', 'Failed to log food entry');
    }
  };

  const mealTypeOptions = [
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Dinner', value: 'dinner' },
    { label: 'Snacks', value: 'snacks' },
    { label: 'Drinks', value: 'drinks' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Food Name</ThemedText>
          <TextInput
            value={foodName}
            onChangeText={setFoodName}
            placeholder="Enter food name"
            style={styles.input}
            required
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Meal Type</ThemedText>
          <Picker
            selectedValue={mealType}
            onValueChange={setMealType}
            items={mealTypeOptions}
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Calories</ThemedText>
          <TextInput
            value={calories}
            onChangeText={setCalories}
            placeholder="Enter calories"
            keyboardType="numeric"
            style={styles.input}
            required
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Serving Size</ThemedText>
          <TextInput
            value={servingSize}
            onChangeText={setServingSize}
            placeholder="Enter serving size (optional)"
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Date</ThemedText>
          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            style={styles.input}
            required
          />
        </View>

        <Button
          title="Log Food"
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          <Ionicons 
            name="add-circle" 
            size={24} 
            color="white" 
            style={{ marginRight: 10 }}
          />
        </Button>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.light.tint,
  },
});