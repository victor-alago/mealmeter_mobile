import React, { useState } from 'react';
import { 
  StyleSheet, 
  Image, 
  View, 
  Platform, 
  ScrollView, 
  useColorScheme,
  Alert 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';

interface FoodItem {
  name: string;
  calories: number;
  serving: string;
}

interface CalorieData {
  calories: {
    total: number;
  };
  food_items: FoodItem[];
}

export default function FoodRecognitionScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [calorieData, setCalorieData] = useState<CalorieData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        setCalorieData(null);
        setError(null);
      }
    } catch (err) {
      console.error('Image picker error:', err);
      setError('Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        setCalorieData(null);
        setError(null);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Failed to take photo. Please try again.');
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      setError('Please select or take an image first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await uploadImage(image);
      setCalorieData(result);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetScreen = () => {
    setImage(null);
    setCalorieData(null);
    setError(null);
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select an option',
      '',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Library',
          onPress: pickImage,
        },
      ],
    );
  };

  return (
    <ThemedView style={styles.container}>
      {!image && (
        <View style={styles.centerContainer}>
          <ThemedText style={styles.titleText}>
            Snap a photo of your food ..
          </ThemedText>
          <Image 
            source={require('../../assets/images/original-7224bf5de15496d0775a5055295ff17c.gif')}
            style={styles.fullScreenImage}
          />
        </View>
      )}

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {image && (
          <View>
            <Image source={{ uri: image }} style={styles.image} />
            {!calorieData && (
              <Button
                onPress={analyzeImage}
                style={styles.analyzeButton}
                disabled={loading}
                variant="primary">
                <ThemedText style={styles.buttonTextAnalyze}>{loading ? 'Analyzing...' : 'Analyze Image'}</ThemedText>
              </Button>
            )}
          </View>
        )}

        {error && <ThemedText style={styles.error}>{error}</ThemedText>}

        {calorieData && (
          <View style={[styles.resultsContainer, isDark && styles.resultsContainerDark]}>
            <ThemedText type="title" style={styles.totalCalories}>
              {calorieData.calories.total} calories
            </ThemedText>
            
            <View style={styles.foodItemsContainer}>
              {calorieData.food_items.map((item, index) => (
                <View key={index} style={styles.foodItem}>
                  <ThemedText type="subtitle" style={styles.foodName}>
                    {item.name}
                  </ThemedText>
                  <View style={styles.foodDetails}>
                    <ThemedText style={styles.calories}>
                      {item.calories} cal
                    </ThemedText>
                    <ThemedText style={styles.serving}>
                      {item.serving}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>

            <Button
              onPress={resetScreen}
              style={styles.doneButton}
              variant="primary">
              <ThemedText style={styles.buttonTextDone}>Done</ThemedText>
            </Button>
          </View>
        )}
      </ScrollView>

      {/* Only show the camera button when there's no image */}
      {!image && (
        <View style={styles.cameraButtonContainer}>
          <Button
            onPress={showImageOptions}
            style={styles.cameraButton}
            variant="primary">
            <Ionicons 
              name="camera" 
              size={30} 
              color="#fff"
            />
          </Button>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  analyzeButton: {
    alignSelf: 'center',
    backgroundColor: 'black', 
    borderColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    marginTop: 40,
    paddingVertical: 14,
    width: '98%',
  },
  buttonTextAnalyze: {
    color: 'white',  
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDone: {
    color: 'black',  
    fontSize: 16,
    fontWeight: '600',
  },
  calories: {
    color: '#000000',  
    fontSize: 16,
    fontWeight: '500',
  },
  cameraButton: {
    alignItems: 'center',
    backgroundColor: 'black',
    borderColor: 'white',
    borderRadius: 40,
    borderWidth: 3,
    height: 80,
    justifyContent: 'center',
    width: 80,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cameraButtonContainer: {
    alignItems: 'center',
    bottom: 55,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 10,
  },
  centerContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'black',  
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100, 
  },
  doneButton: {
    alignSelf: 'center',
    backgroundColor: 'white',  
    borderColor: 'black',
    borderRadius: 16,
    borderWidth: 2,
    marginTop: 24,
    paddingVertical: 14,
    width: '103%',
  },
  error: {
    color: '#FF6B6B', 
    marginVertical: 10,
    textAlign: 'center',
  },
  foodDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    opacity: 0.8,
  },
  foodItem: {
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  foodItemsContainer: {
    gap: 16,
  },
  foodName: {
    color: '#000000',  
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  fullScreenImage: {
    alignSelf: 'center',
    borderRadius: 40,
    height: '84%',
    position: 'absolute',
    resizeMode: 'cover',
    top: 230,
    width: '84%',
  },
  image: {
    alignSelf: 'center',
    borderRadius: 35,
    height: 340,
    marginTop: 50,
    resizeMode: 'contain',
    width: 340,
  },
  resultsContainer: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF', 
    borderRadius: 20,
    marginTop: 50,
    padding: 24,
    width: '98%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  resultsContainerDark: {
    backgroundColor: '#FFFFFF',  
  },
  serving: {
    color: '#000000',  
    fontSize: 16,
  },
  titleText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',  
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    position: 'absolute',
    top: 116,
    zIndex: 1,
  },
  totalCalories: {
    color: '#000000',  
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 24,
    marginTop: 10,
    textAlign: 'center',
  },
});