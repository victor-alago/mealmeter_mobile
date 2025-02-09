import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Platform } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

interface PickerItem {
  label: string;
  value: string;
}

interface PickerProps {
  items: PickerItem[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function Picker({ items, selectedValue, onValueChange, placeholder = 'Select an option' }: PickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const selectedItem = items.find(item => item.value === selectedValue);
  const borderColor = Colors[colorScheme].tint;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[
          styles.pickerButton,
          { borderColor },
        ]}>
        <ThemedText style={styles.pickerText}>
          {selectedItem ? selectedItem.label : placeholder}
        </ThemedText>
        <Ionicons 
          name="chevron-down" 
          size={24} 
          color={Colors[colorScheme ?? 'light'].text}
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View 
            style={[
              styles.modalContent,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].background,
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>{placeholder}</ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons 
                  name="close" 
                  size={24} 
                  color={Colors[colorScheme ?? 'light'].text}
                />
              </TouchableOpacity>
            </View>
            {items.map((item) => (
              item.value ? (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.optionButton,
                    selectedValue === item.value && styles.selectedOption,
                    {
                      borderColor: Colors[colorScheme ?? 'light'].border,
                    }
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <ThemedText style={[
                    styles.optionText,
                    selectedValue === item.value && styles.selectedOptionText
                  ]}>
                    {item.label}
                  </ThemedText>
                </TouchableOpacity>
              ) : null
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalHeader: {
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
  },
  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionButton: {
    borderColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    padding: 15,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  pickerButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  pickerText: {
    fontSize: 16,
  },
  selectedOption: {
    backgroundColor: Colors.light.tint,
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 