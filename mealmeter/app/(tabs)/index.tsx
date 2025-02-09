// File: /Users/Tin1/Downloads/Mealmeter/mealmeter_mobile/mealmeter/app/(tabs)/dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Custom Components
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Calendar } from '@/components/Calendar';
import { CalorieProgress } from '@/components/CalorieProgress';

// Utilities and Configuration
import { API_URL } from '@/config/api';
import { getAuthToken } from '@/utils/secureStorage';
import { Colors } from '@/constants/Colors';

export default function DashboardScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      // Fetch user profile to determine if setup is needed
      const profileResponse = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const profileData = profileResponse.data.profile_data;

      // If no profile or profile is not set up, redirect to setup
      if (!profileData || !profileData.is_setup) {
        router.replace('/setup');
        return;
      }

      // If profile exists and is set up, proceed with dashboard data
      const insightsResponse = await axios.get(`${API_URL}/insights/nutrition`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(profileData);
      setInsights(insightsResponse.data);
      setError('');
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      
      // If there's an error fetching profile, redirect to setup
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        router.replace('/setup');
      } else {
        setError('Failed to load dashboard. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Expose reload function globally
  React.useEffect(() => {
    global.reloadDashboard = fetchDashboardData;
  }, [fetchDashboardData]);

  const handleCompleteSetup = () => {
    router.push('/onboarding/setup');
  };

  const profileComplete = profile && profile.is_setup;

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading dashboard...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  const remainingCalories = insights 
    ? Math.max(0, (insights.target_calories || 2000) - (insights.total_calories || 0)) 
    : 0;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!profileComplete && (
          <TouchableOpacity 
            style={styles.setupPrompt} 
            onPress={handleCompleteSetup}
          >
            <ThemedText style={styles.setupPromptText}>
              Complete your profile setup
            </ThemedText>
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={Colors.light.tint} 
            />
          </TouchableOpacity>
        )}

        {profileComplete && (
          <>
            <CalorieProgress 
              totalCalories={insights?.total_calories || 0}
              targetCalories={insights?.target_calories || 2000}
              remainingCalories={remainingCalories}
            />

            <Calendar profileComplete={profileComplete} />
            
            <View style={styles.nutritionSummary}>
              <ThemedText style={styles.sectionTitle}>Your Daily Nutrition Breakdown</ThemedText>
              <View style={styles.macroContainer}>
                <View style={styles.macroItemCard}>
                  <View style={[styles.macroIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <Ionicons 
                      name="restaurant" 
                      size={24} 
                      color="white" 
                    />
                  </View>
                  <ThemedText style={styles.macroLabel}>Protein</ThemedText>
                  <ThemedText style={styles.macroValue}>
                    {insights?.protein_grams || 0}g
                  </ThemedText>
                </View>
                <View style={styles.macroItemCard}>
                  <View style={[styles.macroIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <Ionicons 
                      name="pizza" 
                      size={24} 
                      color="white" 
                    />
                  </View>
                  <ThemedText style={styles.macroLabel}>Carbs</ThemedText>
                  <ThemedText style={styles.macroValue}>
                    {insights?.carbs_grams || 0}g
                  </ThemedText>
                </View>
                <View style={styles.macroItemCard}>
                  <View style={[styles.macroIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <Ionicons 
                      name="water" 
                      size={24} 
                      color="white" 
                    />
                  </View>
                  <ThemedText style={styles.macroLabel}>Fats</ThemedText>
                  <ThemedText style={styles.macroValue}>
                    {insights?.fats_grams || 0}g
                  </ThemedText>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    color: Colors.light.error,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroIconContainer: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginBottom: 10,
    width: 40,
  },
  macroItemCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 15,
    width: '30%',
  },
  macroLabel: {
    color: 'white',
    fontSize: 14,
  },
  macroValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nutritionSummary: {
    alignSelf: 'center',
    backgroundColor: Colors.light.tint,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
    padding: 15,
    width: '92%',
  },
  scrollContainer: {
    flexGrow: 1,  
    padding: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  setupPrompt: {
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 15,
  },
  setupPromptText: {
    fontSize: 16,
  },
});