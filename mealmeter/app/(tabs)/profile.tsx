import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { API_URL } from '@/config/api';
import { getAuthToken } from '@/utils/secureStorage';
import { Picker } from '@/components/ui/Picker';
import { TextInput } from '@/components/ui/TextInput';
import { TabControl } from '@/components/ui/TabControl';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

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
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
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
    } catch (err) {
      console.error('Password update error:', err);
      setError(err.response?.data?.detail || 'Failed to update password');
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
            <Button
              title="Save"
              onPress={handleSave}
              variant="primary"
              style={[styles.actionButton, { backgroundColor: Colors.light.tint }]}
            >
              <Ionicons name="save-outline" size={24} color="white" />
            </Button>
            <Button
              title="Cancel"
              onPress={() => setEditField(null)}
              variant="secondary"
              style={[styles.actionButton, { backgroundColor: '#666' }]}
            >
              <Ionicons name="close-circle-outline" size={24} color="white" />
            </Button>
          </View>
        </View>
      );
    }

    // Special rendering for email field
    if (field === 'email') {
      return (
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <ThemedText style={styles.fieldValue}>
            {profile[field]?.toString() || 'Not set'}
          </ThemedText>
        </View>
      );
    }

    return (
      <TouchableOpacity 
        onPress={() => {
          if (field !== 'email') {
            setEditField(field);
            setEditValue(profile[field] || '');
          }
        }}
        style={styles.fieldContainer}
      >
        <View style={styles.fieldHeader}>
          <ThemedText style={styles.label}>{label}</ThemedText>
          {field !== 'email' && (
            <Button
              onPress={() => {
                setEditField(field);
                setEditValue(profile[field] || '');
              }}
              variant="text"
              style={styles.editButton}
            >
              <Ionicons name="create-outline" size={20} color="white" />
            </Button>
          )}
        </View>
        <ThemedText style={styles.fieldValue}>
          {Array.isArray(profile[field]) 
            ? profile[field].join(', ') 
            : profile[field]?.toString() || 'Not set'}
        </ThemedText>
      </TouchableOpacity>
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
              <Button 
                onPress={handlePasswordUpdate}
                title="Update Password"
                variant="primary"
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
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color="white" 
                  style={{ marginRight: 8 }}
                />
              </Button>
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
  container: {
    flex: 1,
    padding: 16,
  },
  profileTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  sectionContainer: {
    marginBottom: 25,
    gap: 15,
  },
  fieldContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 10,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
    fontWeight: '600',
  },
  inputField: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.tint,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  editButtonText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldValue: {
    marginTop: 8,
  },
  errorContainer: {
    backgroundColor: Colors.light.errorBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.light.errorText,
  },
  tabContainer: {
    marginBottom: 20,
  },
});

export default ProfileScreen;