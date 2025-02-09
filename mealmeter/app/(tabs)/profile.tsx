import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Picker } from '@/components/ui/Picker';
import { TextInput } from '@/components/ui/TextInput';
import { TabControl } from '@/components/ui/TabControl';
import { Colors } from '@/constants/Colors';
import axios from 'axios';
import { API_URL } from '@/config/api';
import { getAuthToken } from '@/utils/secureStorage';

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' }
];

const goalOptions = [
  { label: 'Weight Loss', value: 'weight loss' },
  { label: 'Weight Gain', value: 'weight gain' },
  { label: 'Maintenance', value: 'weight maintenance' },
  { label: 'Muscle Gain', value: 'muscle gain' }
];

const dietTypeOptions = [
  { label: 'Standard', value: 'standard' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Keto', value: 'keto' },
  { label: 'Paleo', value: 'paleo' }
];

const ProfileScreen = () => {
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Personal');
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });

  const fetchProfile = async () => {
    try {
      const token = await getAuthToken();
      console.log('Fetching profile with token:', token?.slice(0, 10) + '...');
      
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Profile API response:', response.data);
      setProfile(response.data.profile_data || {});
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!editField) return;
    
    if (editField === 'height_cm' && Number(editValue) <= 0) {
      setError('Height must be positive');
      return;
    }

    try {
      const token = await getAuthToken();
      await axios.put(`${API_URL}/users/profile`, {
        ...profile,
        [editField]: editValue
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditField(null);
      fetchProfile();
      setError('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Update failed');
      } else if (err instanceof Error) {
        setError(err.message || 'An unexpected error occurred');
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handlePasswordUpdate = async () => {
    // Validate password fields
    if (!passwords.oldPassword || !passwords.newPassword) {
      setError('Please enter both old and new passwords');
      return;
    }

    // Validate new password length
    if (passwords.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    try {
      const token = await getAuthToken();
      await axios.post(`${API_URL}/auth/update-password`, 
        {
          old_password: passwords.oldPassword,
          new_password: passwords.newPassword
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Reset password fields
      setPasswords({ oldPassword: '', newPassword: '' });
      
      // Show success message
      setError('Password updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    } catch (err: unknown) {
      console.error('Password update error:', err);
      
      // Type-safe error handling
      if (axios.isAxiosError(err)) {
        // Axios-specific error handling
        setError(err.response?.data?.detail || 'Failed to update password');
      } else if (err instanceof Error) {
        // Generic Error object handling
        setError(err.message || 'An unexpected error occurred');
      } else {
        // Fallback for other unknown error types
        setError('An unknown error occurred');
      }
    }
  };

  const renderEditableField = (field: string, label: string, options: { editable?: boolean } = {}) => {
    const { editable = true } = options;
    if (editField === field) {
      return (
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>{label}</ThemedText>
          
          {['gender', 'goal', 'diet_type'].includes(field) ? (
            <Picker
              selectedValue={editValue}
              onValueChange={setEditValue}
              items={
                field === 'gender' ? genderOptions :
                field === 'goal' ? goalOptions :
                dietTypeOptions
              }
            />
          ) : ['allergies', 'medical_conditions'].includes(field) ? (
            <TextInput
              value={editValue}
              onChangeText={setEditValue}
              placeholder="Comma separated values"
              multiline
              style={styles.inputField}
            />
          ) : (
            <TextInput
              value={editValue}
              onChangeText={setEditValue}
              style={styles.inputField}
              keyboardType={['height_cm', 'weight_kg', 'target_weight'].includes(field) 
                ? 'numeric' 
                : 'default'}
              editable={editable}
            />
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.actionButton, { backgroundColor: Colors.light.tint }]}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="save-outline" size={24} color="white" />
                <Text style={styles.buttonText}>Save</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEditField(null)}
              style={[styles.actionButton, { backgroundColor: Colors.light.background }]}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="close-outline" size={24} color={Colors.light.text} />
                <Text style={[styles.buttonText, { color: Colors.light.text }]}>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Render non-editable field
    return (
      <View style={styles.fieldContainer}>
        <View style={styles.fieldHeader}>
          <ThemedText style={styles.label}>{label}</ThemedText>
          {editable && (
            <TouchableOpacity 
              onPress={() => {
                setEditField(field);
                setEditValue(profile[field] || '');
              }}
              style={styles.editButton}
            >
              <Ionicons name="create-outline" size={20} color="white" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        <ThemedText style={styles.fieldValue}>
          {profile?.[field] || 'Not set'}
        </ThemedText>
      </View>
    );
  };

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <ThemedText>{error}</ThemedText>;

  return (
    <ThemedView style={styles.container}>

      
      <TabControl
        tabs={['Personal', 'Physical', 'Goals', 'Health']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        style={styles.tabContainer}
      />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {activeTab === 'Personal' && (
          <View style={styles.sectionContainer}>
            {renderEditableField('gender', 'Gender')}
            {renderEditableField('birthdate', 'Birthdate')}
            {renderEditableField('email', 'Email', { editable: false })}
            <View style={styles.fieldContainer}>
              <ThemedText style={styles.label}>Update Password</ThemedText>
              <TextInput
                value={passwords.oldPassword}
                onChangeText={text => setPasswords(p => ({ ...p, oldPassword: text }))}
                placeholder="Old Password"
                secureTextEntry
              />
              <View style={{ height: 15 }} /> {/* Add spacing between inputs */}
              <TextInput
                value={passwords.newPassword}
                onChangeText={text => setPasswords(p => ({ ...p, newPassword: text }))}
                placeholder="New Password"
                secureTextEntry
              />
              <TouchableOpacity 
                onPress={handlePasswordUpdate}
                style={{ 
                  marginTop: 10, 
                  backgroundColor: Colors.light.tint,
                  borderRadius: 10,
                  paddingVertical: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View style={styles.buttonContent}>
                  <Ionicons 
                    name="lock-closed-outline" 
                    size={20} 
                    color="white" 
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.buttonText}>Update Password</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'Physical' && (
          <View style={styles.sectionContainer}>
            {renderEditableField('height_cm', 'Height (cm)')}
            {renderEditableField('weight_kg', 'Weight (kg)')}
          </View>
        )}

        {activeTab === 'Goals' && (
          <View style={styles.sectionContainer}>
            {renderEditableField('goal', 'Goal')}
            {profile?.goal !== 'weight maintenance' && (
              <>
                {renderEditableField('target_weight', 'Target Weight')}
                {renderEditableField('weekly_goal_kg', 'Weekly Goal')}
              </>
            )}
          </View>
        )}

        {activeTab === 'Health' && (
          <View style={styles.sectionContainer}>
            {renderEditableField('diet_type', 'Diet Type')}
            {renderEditableField('allergies', 'Allergies')}
            {renderEditableField('medical_conditions', 'Medical Conditions')}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    borderRadius: 8,
    flex: 1,
    paddingVertical: 12,
  },
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  editButton: {
    alignItems: 'center',
    backgroundColor: Colors.light.tint,
    borderRadius: 8,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  fieldContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: Colors.light.border,
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
  },
  fieldHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fieldValue: {
    marginTop: 8,
  },
  inputField: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: Colors.light.border,
    borderRadius: 8,
    borderWidth: 1,
    color: Colors.light.text,
    fontSize: 16,
    height: 50,
    paddingHorizontal: 16,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  sectionContainer: {
    gap: 15,
    marginBottom: 25,
  },
  tabContainer: {
    marginBottom: 20,
  },
});

export default ProfileScreen;