import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import { API_URL } from '@/config/api';
import { getAuthToken } from '@/utils/secureStorage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { Picker } from '@/components/ui/Picker';
import { DatePicker } from '@/components/ui/DatePicker';
import { Colors } from '@/constants/Colors';

export default function SetupScreen() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gender: '',
    birthdate: '',
    height_cm: '',
    weight_kg: '',
    activity_level: '',
    goal: '',
    target_weight: '',
    weekly_goal_kg: '',
    diet_type: '',
    food_preferences: [],
    allergies: [],
    medical_conditions: [],
    medications: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleNext = () => {
    let canProceed = false;
    switch (step) {
      case 1:
        canProceed = Boolean(formData.gender && formData.birthdate);
        break;
      case 2:
        canProceed = Boolean(formData.height_cm && formData.weight_kg);
        break;
      case 3:
        canProceed = Boolean(formData.activity_level && formData.goal);
        break;
      case 4:
        canProceed = Boolean(formData.diet_type);
        break;
      default:
        canProceed = false;
    }

    if (canProceed) {
      if (step < 4) setStep(step + 1);
      else submitForm();
    } else {
      Alert.alert('Error', 'Please fill all required fields before proceeding.');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitForm = async () => {
    setIsLoading(true);
    
    try {
      const token = await getAuthToken();
      if (!token) {
        Alert.alert('Error', 'Authentication token not found. Please login again.');
        return;
      }

      const preparedData = {
        ...formData,
        birthdate: new Date(formData.birthdate).toISOString().split('T')[0],
        height_cm: parseFloat(formData.height_cm),
        weight_kg: parseFloat(formData.weight_kg),
        target_weight: formData.goal === 'weight maintenance' ? null : parseFloat(formData.target_weight),
        weekly_goal_kg: formData.goal === 'weight maintenance' ? null : parseFloat(formData.weekly_goal_kg),
      };

      console.log('Submitting data:', preparedData);
      console.log('API URL:', `${API_URL}/users/profile`);

      try {
        // First try POST
        const response = await axios.post(
          `${API_URL}/users/profile`,
          preparedData,
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          }
        );
        router.replace('/(tabs)');
      } catch (error: any) {
        if (error.response?.data?.detail === "Profile already exists. Use PUT to update.") {
          // If profile exists, try PUT instead
          const putResponse = await axios.put(
            `${API_URL}/users/profile`,
            preparedData,
            {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              timeout: 10000,
            }
          );
          router.replace('/(tabs)');
        } else {
          throw error; // Re-throw if it's a different error
        }
      }
    } catch (error: any) {
      console.error('Failed to submit profile:', error);
      
      if (error.response) {
        console.error('Server error:', error.response.data);
        Alert.alert('Error', error.response.data.detail?.[0]?.msg || error.response.data.detail || 'Server error occurred');
      } else if (error.request) {
        console.error('Network error:', error.request);
        Alert.alert(
          'Network Error', 
          'Unable to connect to the server. Please check your internet connection.'
        );
      } else {
        console.error('Error:', error.message);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <ThemedText type="title" style={styles.stepTitle}>Personalize Your Plan By Giving Us Some Information</ThemedText>
            <ThemedText type="subtitle" style={styles.stepSubtitle}>Step 1: Personal Information</ThemedText>
            
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>To which gender identity do you most identify?</ThemedText>
              <Picker
                selectedValue={formData.gender}
                onValueChange={(value) => handleChange('gender', value)}
                items={[
                  { label: 'Select Gender', value: '' },
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                  { label: 'Other', value: 'other' }
                ]}
                style={{ borderColor: 'white' }}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>What's your date of birth?</ThemedText>
              <DatePicker
                value={formData.birthdate}
                onChange={(date) => handleChange('birthdate', date)}
                placeholder="Select your date of birth"
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <ThemedText type="title" style={styles.stepTitle}>Physical Details</ThemedText>
            
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Height (cm):</ThemedText>
              <TextInput
                placeholder="Enter your height"
                value={formData.height_cm}
                onChangeText={(value) => handleChange('height_cm', value)}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Weight (kg):</ThemedText>
              <TextInput
                placeholder="Enter your weight"
                value={formData.weight_kg}
                onChangeText={(value) => handleChange('weight_kg', value)}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Activity Level:</ThemedText>
              <Picker
                selectedValue={formData.activity_level}
                onValueChange={(value) => handleChange('activity_level', value)}
                items={[
                  { label: 'Select Activity Level', value: '' },
                  { label: 'Sedentary', value: 'sedentary' },
                  { label: 'Lightly Active', value: 'lightly active' },
                  { label: 'Moderately Active', value: 'moderately active' },
                  { label: 'Very Active', value: 'very active' },
                  { label: 'Extra Active', value: 'extra active' }
                ]}
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <ThemedText type="title" style={styles.stepTitle}>Health Goals</ThemedText>
            
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Goal Type:</ThemedText>
              <Picker
                selectedValue={formData.goal}
                onValueChange={(value) => handleChange('goal', value)}
                items={[
                  { label: 'Select Goal', value: '' },
                  { label: 'Weight Loss', value: 'weight loss' },
                  { label: 'Weight Gain', value: 'weight gain' },
                  { label: 'Weight Maintenance', value: 'weight maintenance' },
                  { label: 'Muscle Gain', value: 'muscle gain' }
                ]}
              />
            </View>

            {formData.goal !== 'weight maintenance' && (
              <>
                <View style={styles.formGroup}>
                  <ThemedText style={styles.label}>Target Weight (kg):</ThemedText>
                  <TextInput
                    placeholder="Enter target weight"
                    value={formData.target_weight}
                    onChangeText={(value) => handleChange('target_weight', value)}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>

                <View style={styles.formGroup}>
                  <ThemedText style={styles.label}>Weekly Goal Weight (kg):</ThemedText>
                  <TextInput
                    placeholder="Enter weekly goal"
                    value={formData.weekly_goal_kg}
                    onChangeText={(value) => handleChange('weekly_goal_kg', value)}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>
              </>
            )}

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Dietary Preference:</ThemedText>
              <Picker
                selectedValue={formData.diet_type}
                onValueChange={(value) => handleChange('diet_type', value)}
                items={[
                  { label: 'Select Diet Type', value: '' },
                  { label: 'Standard', value: 'standard' },
                  { label: 'Vegetarian', value: 'vegetarian' },
                  { label: 'Vegan', value: 'vegan' },
                  { label: 'Keto', value: 'keto' },
                  { label: 'Paleo', value: 'paleo' }
                ]}
              />
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <ThemedText type="title" style={styles.stepTitle}>Health and Lifestyle</ThemedText>
            
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Food Preferences (optional):</ThemedText>
              <TextInput
                placeholder="Enter food preferences"
                value={formData.food_preferences.join(', ')}
                onChangeText={(value) => handleArrayInput('food_preferences', value)}
                multiline
                style={styles.input}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Allergies (optional):</ThemedText>
              <TextInput
                placeholder="Enter allergies"
                value={formData.allergies.join(', ')}
                onChangeText={(value) => handleArrayInput('allergies', value)}
                multiline
                style={styles.input}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Medical Conditions (optional):</ThemedText>
              <TextInput
                placeholder="Enter medical conditions"
                value={formData.medical_conditions.join(', ')}
                onChangeText={(value) => handleArrayInput('medical_conditions', value)}
                multiline
                style={styles.input}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Medications (optional):</ThemedText>
              <TextInput
                placeholder="Enter medications"
                value={formData.medications.join(', ')}
                onChangeText={(value) => handleArrayInput('medications', value)}
                multiline
                style={styles.input}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const handleArrayInput = (field: string, value: string) => {
    if (!value.trim()) {
      handleChange(field, []);
      return;
    }
    const isValidInput = value.split(',').every(item => /^[a-zA-Z\s]*$/.test(item.trim()));
    if (!isValidInput) {
      Alert.alert('Invalid Input', 'Please enter valid inputs separated by commas. Only alphabetic characters and spaces are allowed.');
      return;
    }
    handleChange(field, value.split(',').map(item => item.trim()));
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderStep()}
        
        <View style={styles.buttonContainer}>
          {step > 1 && (
            <Button
              onPress={handleBack}
              style={styles.button}
              variant="secondary">
              <ThemedText>Back</ThemedText>
            </Button>
          )}
          
          <Button
            onPress={handleNext}
            style={styles.button}
            variant="secondary">
            <ThemedText>{step === 4 ? 'Submit' : 'Next'}</ThemedText>
          </Button>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  stepContainer: {
    gap: 16,
  },
  stepTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  stepSubtitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderColor: Colors.light.tint,
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}); 